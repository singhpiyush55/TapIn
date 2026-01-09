import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, Mail, Phone, Briefcase, LogOut, Plus, User, Shield } from 'lucide-react';

const API_BASE_URL = 'https://tapin-be.onrender.com'; // I know this should be in .env. Ignore for now. 

// Main App Component
export default function App() {
  const [currentPage, setCurrentPage] = useState('landing');
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('tapinToken');
    const savedRole = localStorage.getItem('tapinRole');
    if (savedToken && savedRole) {
      setToken(savedToken);
      setUserRole(savedRole);
      setCurrentPage(savedRole === 'admin' ? 'adminDashboard' : 'userDashboard');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('tapinToken');
    localStorage.removeItem('tapinRole');
    setToken(null);
    setUserRole(null);
    setCurrentPage('landing');
  };

  const handleLoginSuccess = (jwtToken, role) => {
    localStorage.setItem('tapinToken', jwtToken);
    localStorage.setItem('tapinRole', role);
    setToken(jwtToken);
    setUserRole(role);
    setShowLoginModal(false);
    setCurrentPage(role === 'admin' ? 'adminDashboard' : 'userDashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {currentPage === 'landing' && (
        <LandingPage onSignIn={() => setShowLoginModal(true)} />
      )}
      
      {currentPage === 'userDashboard' && (
        <UserDashboard token={token} onLogout={handleLogout} />
      )}
      
      {currentPage === 'adminDashboard' && (
        <AdminDashboard token={token} onLogout={handleLogout} />
      )}

      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
    </div>
  );
}

// Landing Page Component
function LandingPage({ onSignIn }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700">
      <nav className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-white text-3xl font-bold flex items-center gap-2">
          <Clock className="w-8 h-8" />
          TapIn
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/demo.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white font-semibold underline hover:text-gray-200"
          >
            DEMO
          </a>

          <button
            onClick={onSignIn}
            className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            Sign In
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-20">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl font-bold mb-6">
            Modern Attendance Management Made Simple
          </h1>
          <p className="text-xl mb-12 text-blue-100">
            Track employee attendance seamlessly with RFID technology. Real-time monitoring, automated reporting, and powerful analytics.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8">
              <div className="bg-blue-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-blue-600">
                Monitor attendance instantly with IoT-enabled RFID technology
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8">
              <div className="bg-purple-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">User Management</h3>
              <p className="text-blue-600">
                Easily manage employees and administrators from one dashboard
              </p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-xl p-8">
              <div className="bg-pink-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-blue-600">
                Visual attendance calendar with detailed reporting features
              </p>
            </div>
          </div>

          <button
            onClick={onSignIn}
            className="mt-16 bg-white text-blue-600 px-12 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition transform hover:scale-105"
          >
            Get Started Now
          </button>
        </div>
      </div>
    </div>
  );
}

// Login Modal Component
function LoginModal({ onClose, onLoginSuccess }) {
  const [role, setRole] = useState('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = role === 'admin' 
        ? `${API_BASE_URL}/api/v1/admin/login`
        : `${API_BASE_URL}/api/v1/user/login`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        onLoginSuccess(data.token, role);
      } else {
        setError(data.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('Connection error. Please check if the server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Sign In to TapIn
        </h2>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-3">
              I am a:
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={role === 'user'}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <User className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">User</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <Shield className="w-5 h-5 text-gray-600" />
                <span className="text-gray-700">Admin</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

// User Dashboard Component
function UserDashboard({ token, onLogout }) {
  const [userProfile, setUserProfile] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [profileRes, attendanceRes] = await Promise.all([
        fetch(`${API_BASE_URL}/api/v1/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
        fetch(`${API_BASE_URL}/api/v1/user/attendance`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }),
      ]);

      const profileData = await profileRes.json();
      const attendanceData = await attendanceRes.json();

      setUserProfile(profileData);
      setAttendance(attendanceData);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Clock className="w-7 h-7" />
            TapIn
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">My Dashboard</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <ProfileCard profile={userProfile} />
          </div>

          <div className="lg:col-span-2">
            <AttendanceCalendar attendance={attendance} />
          </div>
        </div>
      </div>
    </div>
  );
}

// Profile Card Component
function ProfileCard({ profile }) {
  if (!profile) return null;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-3xl font-bold">
          {profile.name?.charAt(0).toUpperCase() || 'U'}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{profile.name}</h2>
        <p className="text-gray-600">{profile.designation}</p>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 text-gray-700">
          <Mail className="w-5 h-5 text-blue-600" />
          <span className="text-sm">{profile.email}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Phone className="w-5 h-5 text-blue-600" />
          <span className="text-sm">{profile.phone_no}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Briefcase className="w-5 h-5 text-blue-600" />
          <span className="text-sm">RFID: {profile.rfid}</span>
        </div>
        <div className="flex items-center gap-3 text-gray-700">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span className="text-sm">DOB: {profile.dob}</span>
        </div>
      </div>
    </div>
  );
}

// Attendance Calendar Component
function AttendanceCalendar({ attendance }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek, year, month };
  };

  const isPresent = (day) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendance.some(record => record.date === dateStr);
  };

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentDate);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const previousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Attendance</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={previousMonth}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            ←
          </button>
          <span className="text-lg font-semibold">
            {monthNames[month]} {year}
          </span>
          <button
            onClick={nextMonth}
            className="px-3 py-1 bg-gray-100 rounded hover:bg-gray-200"
          >
            →
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {Array.from({ length: startingDayOfWeek }).map((_, index) => (
          <div key={`empty-${index}`} className="aspect-square"></div>
        ))}

        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1;
          const present = isPresent(day);
          return (
            <div
              key={day}
              className={`aspect-square flex items-center justify-center rounded-lg font-semibold ${
                present
                  ? 'bg-green-500 text-white'
                  : 'bg-red-100 text-red-600'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex gap-6 mt-6 justify-center">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span className="text-sm text-gray-700">Present</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded"></div>
          <span className="text-sm text-gray-700">Absent</span>
        </div>
      </div>
    </div>
  );
}

// Admin Dashboard Component
function AdminDashboard({ token, onLogout }) {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setUsers(data.users || []);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const viewUserProfile = async (userId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/userprofile`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      setSelectedUser(data);
      setActiveTab('userProfile');
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Shield className="w-7 h-7" />
            TapIn Admin
          </div>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-8">
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => {
              setActiveTab('users');
              setSelectedUser(null);
            }}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            User List
          </button>
          <button
            onClick={() => setShowAddUserForm(true)}
            className="px-6 py-2 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add User
          </button>
        </div>

        {activeTab === 'users' && (
          <UserListTable users={users} onViewProfile={viewUserProfile} />
        )}

        {activeTab === 'userProfile' && selectedUser && (
          <UserProfileView user={selectedUser} token={token} />
        )}
      </div>

      {showAddUserForm && (
        <AddUserModal
          token={token}
          onClose={() => setShowAddUserForm(false)}
          onSuccess={() => {
            setShowAddUserForm(false);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
}

// User List Table Component
function UserListTable({ users, onViewProfile }) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Name
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Email
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                RFID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-800">
                  {user.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.email}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  {user.rfid}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onViewProfile(user._id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-semibold"
                  >
                    View Profile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// User Profile View Component
function UserProfileView({ user, token }) {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/user/attendanceForAdmin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await response.json();
      setAttendance(data);
    } catch (err) {
      console.error('Error fetching attendance:', err);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <ProfileCard profile={user} />
      </div>
      <div className="lg:col-span-2">
        <AttendanceCalendar attendance={attendance} />
      </div>
    </div>
  );
}

// Add User Modal Component
function AddUserModal({ token, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    rfid: '',
    dob: '',
    gender: '',
    designation: '',
    email: '',
    phone_no: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/admin/adduser`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message || 'User created successfully!');
        setTimeout(() => {
          onSuccess();
        }, 1500);
      } else {
        setError(data.message || 'Failed to create user');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-gray-800">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                RFID Card *
              </label>
              <input
                type="text"
                name="rfid"
                value={formData.rfid}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Phone Number
              </label>
              <input
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Password *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-8 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



// import { useState } from 'react'
// import './App.css'

// function App() {
//   return(
//     <div>
//       <h1 className="text-3xl font-bold underline">Hello world.</h1>
//     </div>
//   )
// }

// export default App
