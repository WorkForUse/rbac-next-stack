'use client';
import { useEffect, useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Clock, MapPin, Users, Edit, Trash2, Loader2, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

interface Task {
  id: number;
  title: string;
  description?: string;
  dueDate: string;
  dueTime?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  category: string;
  createdAt: string;
}

interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  date: string;
  attendees: { id: number; name: string; email: string }[];
  location?: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'event';
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()); // Today
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    date: string;
    location: string;
    type: 'meeting' | 'deadline' | 'reminder' | 'event';
  }>({
    title: '',
    description: '',
    startTime: '09:00',
    endTime: '10:00',
    date: '',
    location: '',
    type: 'meeting',
  });

  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/tasks');
      const tasks = response.data || response.data.data || [];
      
      // Convert tasks to calendar events
      const calendarEvents = tasks.map((task: Task) => ({
        id: task.id,
        title: task.title,
        description: task.description,
        startTime: task.dueTime || '09:00',
        endTime: task.dueTime ? addHours(task.dueTime, 1) : '10:00',
        date: normalizeDateString(task.dueDate), // Normalize date format
        attendees: [],
        location: '',
        type: 'reminder' as const,
      }));
      
      console.log('Calendar events loaded:', calendarEvents);
      setEvents(calendarEvents);
    } catch (err: any) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) setUserPerms(JSON.parse(userData).permissions);
    
    fetchEvents();
  }, [fetchEvents]);

  // Refetch events when currentDate changes (month navigation)
  useEffect(() => {
    fetchEvents();
  }, [currentDate, fetchEvents]);

  // Validate and format date for API submission
  const validateAndFormatDate = (dateStr: string): { valid: boolean; error?: string; date?: string } => {
    if (!dateStr) {
      return { valid: false, error: 'Date is required' };
    }

    try {
      // Parse the date string from input (YYYY-MM-DD format)
      const dateObj = new Date(dateStr + 'T00:00:00Z');
      
      // Check if date is valid
      if (isNaN(dateObj.getTime())) {
        return { valid: false, error: 'Invalid date format' };
      }

      // Check if date is in the past (optional - only warn)
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Return the date in YYYY-MM-DD format
      return { 
        valid: true, 
        date: dateStr 
      };
    } catch (err) {
      return { valid: false, error: 'Unable to parse date' };
    }
  };

  const addHours = (time: string, hours: number): string => {
    const [h, m] = time.split(':').map(Number);
    const newHours = (h + hours) % 24;
    return `${String(newHours).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  // Normalize date string to YYYY-MM-DD format
  const normalizeDateString = (dateStr: string): string => {
    if (!dateStr) return '';
    
    // If already in YYYY-MM-DD format, return as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      return dateStr;
    }
    
    // Parse various date formats
    try {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date.toISOString().split('T')[0];
      }
    } catch (e) {
      console.error('Date parse error:', dateStr);
    }
    
    return dateStr;
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      startTime: '09:00',
      endTime: '10:00',
      date: '',
      location: '',
      type: 'meeting',
    });
    setSelectedEvent(null);
    setError(null);
  };

  // Ensure form fields never become undefined to fix controlled input warning
  const safeFormData = {
    title: formData.title ?? '',
    description: formData.description ?? '',
    startTime: formData.startTime ?? '09:00',
    endTime: formData.endTime ?? '10:00',
    date: formData.date ?? '',
    location: formData.location ?? '',
    type: formData.type ?? 'meeting',
  };

  const getDaysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      
      // Validate required fields
      if (!formData.title || !formData.date) {
        setError('Please fill in event title and date');
        return;
      }

      // Validate date format
      const dateValidation = validateAndFormatDate(formData.date);
      if (!dateValidation.valid) {
        setError(dateValidation.error || 'Invalid date');
        return;
      }

      const response = await api.post('/tasks', {
        title: formData.title,
        description: formData.description,
        dueDate: dateValidation.date, // Use validated date
        dueTime: formData.startTime,
        priority: 'medium',
        category: 'Personal',
        status: 'pending',
      });

      setSuccessMsg('Event created successfully');
      setShowCreateModal(false);
      resetForm();
      
      // Refetch events immediately after creation
      await fetchEvents();
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create event';
      setError(errorMsg);
      console.error('Create error:', err);
    }
  };

  const handleUpdateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent) return;
    try {
      setError(null);
      if (!formData.title || !formData.date) {
        setError('Please fill in event title and date');
        return;
      }

      // Validate date format
      const dateValidation = validateAndFormatDate(formData.date);
      if (!dateValidation.valid) {
        setError(dateValidation.error || 'Invalid date');
        return;
      }

      // Try PUT first, fallback to PATCH if not available
      try {
        await api.put(`/tasks/${selectedEvent.id}`, {
          title: formData.title,
          description: formData.description,
          dueDate: dateValidation.date, // Use validated date
          dueTime: formData.startTime,
        });
      } catch (putErr: any) {
        if (putErr.response?.status === 404) {
          // Fallback to PATCH if PUT is not supported
          console.log('PUT not supported, trying PATCH instead');
          await api.patch(`/tasks/${selectedEvent.id}`, {
            title: formData.title,
            description: formData.description,
            dueDate: dateValidation.date, // Use validated date
            dueTime: formData.startTime,
          });
        } else {
          throw putErr;
        }
      }

      setSuccessMsg('Event updated successfully');
      setShowEditModal(false);
      resetForm();
      
      // Refetch events immediately after update
      await fetchEvents();
      
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update event';
      setError(errorMsg);
      console.error('Update error:', err);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        setError(null);
        await api.delete(`/tasks/${id}`);
        setShowEventDetailsModal(false);
        setSuccessMsg('Event deleted successfully');
        
        // Refetch events immediately after deletion
        await fetchEvents();
        
        setTimeout(() => setSuccessMsg(null), 3000);
      } catch (err: any) {
        setError(err.response?.data?.message || 'Failed to delete event');
        console.error(err);
      }
    }
  };

  const openEventDetailsModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setShowEventDetailsModal(true);
    setShowCreateModal(false);
    setShowEditModal(false);
    setError(null);
  };

  const openEditModal = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setFormData({
      title: event.title ?? '',
      description: event.description ?? '',
      startTime: event.startTime ?? '09:00',
      endTime: event.endTime ?? '10:00',
      date: event.date ?? '',
      location: event.location ?? '',
      type: (event.type ?? 'meeting') as 'meeting' | 'deadline' | 'reminder' | 'event',
    });
    setShowEventDetailsModal(false);
    setShowEditModal(true);
  };

  const handleDateClick = (day: number) => {
    const dayEvents = getEventsForDate(day);
    if (dayEvents.length > 0) {
      openEventDetailsModal(dayEvents[0]);
    }
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    console.log(`Looking for events on ${dateStr}:`, events.filter(e => e.date === dateStr));
    return events.filter(event => event.date === dateStr);
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'meeting':
        return 'bg-blue-100 border-blue-300 text-blue-900';
      case 'deadline':
        return 'bg-red-100 border-red-300 text-red-900';
      case 'reminder':
        return 'bg-yellow-100 border-yellow-300 text-yellow-900';
      case 'event':
        return 'bg-purple-100 border-purple-300 text-purple-900';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-900';
    }
  };

  const calendarDays = [];
  const firstDay = getFirstDayOfMonth(currentDate);
  const daysInMonth = getDaysInMonth(currentDate);

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {successMsg && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> {successMsg}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
          {error}
        </div>
      )}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Calendar</h1>
          <p className="text-gray-600 mt-1">Manage your events and schedules</p>
        </div>
        
        {userPerms.includes('manage_tasks') && (
          <button 
            onClick={() => {
              const today = new Date().toISOString().split('T')[0];
              setFormData({ ...formData, date: today });
              setShowCreateModal(true);
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-blue-700"
          >
            <Plus size={16} /> New Event
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={handlePrevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Debug Info - Shows loaded events */}
        {events.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            Loaded {events.length} event{events.length !== 1 ? 's' : ''} from server
          </div>
        )}

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {daysOfWeek.map(day => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2 text-sm uppercase">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const dayEvents = day ? getEventsForDate(day) : [];
            const today = new Date();
            const isToday = day && day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear();
            
            return (
              <div
                key={index}
                onClick={() => day && dayEvents.length > 0 && handleDateClick(day)}
                className={`min-h-24 p-2 border rounded-lg ${
                  day
                    ? isToday
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                    : 'bg-gray-50 border-gray-100'
                } transition-colors ${day && dayEvents.length > 0 ? 'cursor-pointer hover:shadow-md' : ''}`}
              >
                {day && (
                  <>
                    <div className={`text-xs font-bold mb-1 ${isToday ? 'text-blue-600 bg-blue-100 px-2 py-1 rounded w-fit' : 'text-gray-600'}`}>
                      {day}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.length > 0 && (
                        <div className="text-xs text-gray-500 px-1 font-medium mb-1">
                          {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''}
                        </div>
                      )}
                      {dayEvents.slice(0, 2).map(event => (
                        <button
                          key={event.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openEventDetailsModal(event);
                          }}
                          className={`w-full text-xs p-1 rounded border text-left truncate font-medium ${getEventColor(event.type)} hover:opacity-80 transition-opacity cursor-pointer`}
                          title={event.title}
                        >
                          {event.title}
                        </button>
                      ))}
                      {dayEvents.length > 2 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDateClick(day);
                          }}
                          className="text-xs text-blue-600 px-1 font-medium hover:underline w-full text-left"
                        >
                          +{dayEvents.length - 2} more events
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Events */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Upcoming Events</h3>
        <div className="space-y-3">
          {events.length === 0 ? (
            <p className="text-gray-500 text-sm">No upcoming events</p>
          ) : (
            events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .filter(event => {
                const eventDate = new Date(event.date + 'T00:00:00');
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return eventDate >= today;
              })
              .slice(0, 5)
              .map(event => (
                <button
                  key={event.id}
                  onClick={() => openEventDetailsModal(event)}
                  className={`w-full p-4 rounded-lg border ${getEventColor(event.type)} hover:opacity-80 transition-opacity text-left cursor-pointer`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold">{event.title}</p>
                      <div className="flex gap-4 mt-2 text-sm opacity-75">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {event.startTime}
                        </span>
                        {event.location && (
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" /> {event.location}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-2 py-1 bg-white bg-opacity-50 rounded">
                      {new Date(event.date + 'T00:00:00').toLocaleDateString()}
                    </span>
                  </div>
                </button>
              ))
          )}
        </div>
      </div>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Event</h2>
              <button 
                onClick={() => { setShowCreateModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCreateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={safeFormData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={safeFormData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={safeFormData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <div 
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" 
          style={{ zIndex: 99999 }}
          onClick={() => setShowEventDetailsModal(false)}
        >
          <div 
            className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">{selectedEvent.title}</h2>
              <button 
                onClick={() => setShowEventDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div className={`p-3 rounded-lg ${getEventColor(selectedEvent.type)}`}>
                <p className="font-semibold text-sm uppercase">{selectedEvent.type}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Date & Time</p>
                <p className="flex items-center gap-2 text-gray-900">
                  <Clock className="w-4 h-4" />
                  {new Date(selectedEvent.date + 'T00:00:00').toLocaleDateString()} {selectedEvent.startTime} - {selectedEvent.endTime}
                </p>
              </div>

              {selectedEvent.location && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Location</p>
                  <p className="flex items-center gap-2 text-gray-900">
                    <MapPin className="w-4 h-4" />
                    {selectedEvent.location}
                  </p>
                </div>
              )}

              {selectedEvent.description && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Description</p>
                  <p className="text-gray-900 text-sm">{selectedEvent.description}</p>
                </div>
              )}

              {selectedEvent.attendees && selectedEvent.attendees.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-2 flex items-center gap-1">
                    <Users className="w-4 h-4" /> Attendees
                  </p>
                  <div className="space-y-2">
                    {selectedEvent.attendees.map(attendee => (
                      <p key={attendee.id} className="text-sm text-gray-700">
                        {attendee.name} ({attendee.email})
                      </p>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-2 pt-4 border-t border-gray-200">
                {userPerms.includes('manage_tasks') && (
                  <>
                    <button
                      onClick={() => openEditModal(selectedEvent)}
                      className="flex-1 px-4 py-2 text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(selectedEvent.id)}
                      className="flex-1 px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowEventDetailsModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" style={{ zIndex: 99999 }}>
          <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
              <button
                onClick={() => { setShowEditModal(false); resetForm(); }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            <form onSubmit={handleUpdateEvent} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Enter event title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={safeFormData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input
                    type="time"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={safeFormData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                >
                  <option value="meeting">Meeting</option>
                  <option value="deadline">Deadline</option>
                  <option value="reminder">Reminder</option>
                  <option value="event">Event</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={safeFormData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                  value={safeFormData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => { setShowEditModal(false); resetForm(); }}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700"
                >
                  Update Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
