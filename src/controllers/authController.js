import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import catchAsync from '../utils/catchAsync.js';

export const generateTokens = (userId) => {
  const access = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
  const refresh = jwt.sign({ userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
  return { access, refresh };
};

export const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ success: false, message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور' });
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) return res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
  user.lastSeen = Date.now(); user.isOnline = true; await user.save();
  const { access, refresh } = generateTokens(user._id);
  res.status(200).json({ success: true, message: 'تم تسجيل الدخول', token: access, refreshToken: refresh, user: user.profile, meta: { role: user.role, permissions: user.permissions, isVerified: user.isVerified } });
});

export const register = catchAsync(async (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (await User.findOne({ email })) return res.status(400).json({ success: false, message: 'البريد مسجل مسبقاً' });
  const user = await User.create({ name, email, password, role: role || 'help_seeker', phone, permissions: role === 'admin' ? ['*'] : [] });
  const { access, refresh } = generateTokens(user._id);
  res.status(201).json({ success: true, message: 'تم إنشاء الحساب', token: access, refreshToken: refresh, user: user.profile, meta: { role: user.role, permissions: user.permissions, isVerified: user.isVerified } });
});

export const updateLocation = catchAsync(async (req, res) => {
  const { lat, lng } = req.body;
  if (!lat || !lng) return res.status(400).json({ success: false, message: 'يرجى إرسال الإحداثيات' });
  await req.user.updateLocation(lat, lng);
  if (req.io) req.io.emit('user:location_updated', { userId: req.user._id, location: req.user.currentLocation, name: req.user.name });
  res.status(200).json({ success: true, message: 'تم تحديث الموقع', location: req.user.currentLocation });
});

export const logout = catchAsync(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { isOnline: false, lastSeen: Date.now() });
  if (req.io) req.io.emit('user:status_changed', { userId: req.user._id, isOnline: false });
  res.status(200).json({ success: true, message: 'تم تسجيل الخروج' });
});