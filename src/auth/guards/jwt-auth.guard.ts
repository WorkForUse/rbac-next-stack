import { Injectable, UnauthorizedException, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

interface TokenPayload {
  sub: string | number;
  email?: string;
  role?: string;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [key: string]: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<any>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException('No authentication token provided');
    }

    try {
      // Try JWT verification first using NestJS JwtService
      try {
        const payload = this.jwtService.verify(token) as unknown as TokenPayload;
        console.log('[JWT Guard] Successfully verified JWT token, user:', payload.sub);
        request.user = {  
          sub: payload.sub, 
          userId: payload.sub,
          email: payload.email, 
          role: payload.role,
          permissions: payload.permissions || []
        };
        return true;
      } catch (jwtError) {
        // If JWT verification fails, try base64 decode (seed data)
        // But first check if this is actually a JWT (has dots from three base64 parts)
        const jwtParts = token.split('.');
        if (jwtParts.length === 3) {
          // This looks like a JWT but verification failed
          console.log('[JWT Guard] Token looks like JWT but verification failed:', (jwtError as any).message);
          throw new UnauthorizedException('Invalid JWT token');
        }

        console.log('[JWT Guard] Real JWT verification failed, trying base64 decode...');
        
        try {
          // Try to decode as base64
          let decodedStr: string;
          try {
            decodedStr = Buffer.from(token, 'base64').toString('utf-8');
            console.log('[JWT Guard] Base64 decoded successfully, length:', decodedStr.length);
          } catch (decodeErr) {
            console.log('[JWT Guard] Base64 decode failed:', (decodeErr as any).message);
            throw jwtError; // Re-throw original JWT error
          }

          // Check if decoded string looks like JSON
          if (!decodedStr.startsWith('{')) {
            console.log('[JWT Guard] Decoded string is not JSON, not a seed token. Starts with:', decodedStr.substring(0, 30));
            throw jwtError;
          }

          // Try to find the actual JSON object (handle the entire object including arrays)
          let decoded;
          try {
            // Try parsing the whole string first
            decoded = JSON.parse(decodedStr);
            console.log('[JWT Guard] Parsed full decoded string as JSON, payload:', JSON.stringify(decoded));
          } catch (parseErr) {
            // If full parse fails, try to extract just the JSON object by counting braces
            console.log('[JWT Guard] Full parse failed, extracting JSON by counting braces');
            let braceCount = 0;
            let jsonEndIndex = -1;
            for (let i = 0; i < decodedStr.length; i++) {
              if (decodedStr[i] === '{') braceCount++;
              else if (decodedStr[i] === '}') {
                braceCount--;
                if (braceCount === 0) {
                  jsonEndIndex = i + 1;
                  break;
                }
              }
            }
            
            if (jsonEndIndex > 0) {
              const jsonStr = decodedStr.substring(0, jsonEndIndex);
              try {
                decoded = JSON.parse(jsonStr);
                console.log('[JWT Guard] Extracted and parsed JSON object');
              } catch (extractErr) {
                console.log('[JWT Guard] Failed to parse extracted JSON:', (extractErr as any).message);
                throw parseErr;
              }
            } else {
              console.log('[JWT Guard] Could not find matching braces in decoded string');
              throw parseErr;
            }
          }
          
          if (decoded && decoded.sub) {
            console.log('[JWT Guard] Successfully decoded base64 token, user:', decoded.sub);
            request.user = { 
              sub: decoded.sub, 
              userId: decoded.sub,
              email: decoded.email || 'user@example.com',
              role: decoded.role || 'User',
              permissions: decoded.permissions || []
            };
            return true;
          } else {
            console.log('[JWT Guard] Base64 decoded but no valid sub found');
            throw jwtError;
          }
        } catch (b64Error: any) {
          console.log('[JWT Guard] Base64 fallback also failed:', b64Error.message);
          throw new UnauthorizedException('Invalid or expired token');
        }
      }
    } catch (error: any) {
      console.log('[JWT Guard] Final error:', error.message);
      throw new UnauthorizedException(error.message || 'Authentication failed');
    }
  }

  private extractToken(request: any): string | null {
    const authHeader = request.headers?.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    if (request.cookies && request.cookies.accessToken) {
      return request.cookies.accessToken;
    }

    return null;
  }
}
