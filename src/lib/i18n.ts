import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Common
      'app.name': 'Water Control',
      'app.loading': 'Loading...',
      'app.error': 'Error',
      'app.success': 'Success',
      'app.confirm': 'Confirm',
      'app.cancel': 'Cancel',
      'app.save': 'Save',
      'app.delete': 'Delete',
      'app.edit': 'Edit',
      'app.close': 'Close',
      'app.search': 'Search',
      
      // Auth
      'auth.login': 'Login',
      'auth.logout': 'Logout',
      'auth.username': 'Username',
      'auth.password': 'Password',
      'auth.loginBtn': 'Sign In',
      'auth.loginSuccess': 'Login successful',
      'auth.loginError': 'Invalid credentials',
      'auth.required': 'This field is required',
      
      // Dashboard
      'dashboard.title': 'Dashboard',
      'dashboard.devices': 'Devices',
      'dashboard.online': 'Online',
      'dashboard.offline': 'Offline',
      'dashboard.totalDevices': 'Total Devices',
      
      // Device
      'device.status': 'Status',
      'device.online': 'Online',
      'device.offline': 'Offline',
      'device.waterDepth': 'Water Depth',
      'device.height': 'Height',
      'device.flowRate': 'Flow Rate',
      'device.power': 'Power',
      'device.current': 'Current',
      'device.motorState': 'Motor',
      'device.motorOn': 'Motor ON',
      'device.motorOff': 'Motor OFF',
      'device.timerRemaining': 'Timer',
      'device.totalLitres': 'Total Litres',
      'device.energyUsed': 'Energy Used',
      
      // Controls
      'controls.title': 'Controls',
      'controls.motor': 'Motor Control',
      'controls.timer': 'Timer',
      'controls.height': 'Height Setting',
      'controls.turnOn': 'Turn ON',
      'controls.turnOff': 'Turn OFF',
      'controls.setTimer': 'Set Timer',
      'controls.setHeight': 'Set Height',
      'controls.duration': 'Duration (seconds)',
      'controls.targetHeight': 'Target Height (cm)',
      'controls.apply': 'Apply',
      'controls.success': 'Command sent successfully',
      'controls.error': 'Failed to send command',
      
      // Reports
      'reports.title': 'Reports',
      'reports.daily': 'Daily',
      'reports.monthly': 'Monthly',
      'reports.export': 'Export CSV',
      'reports.date': 'Date',
      'reports.deviceId': 'Device',
      'reports.totalEnergy': 'Total Energy',
      'reports.totalWater': 'Total Water',
      
      // Settings
      'settings.title': 'Settings',
      'settings.language': 'Language',
      'settings.theme': 'Theme',
      'settings.profile': 'Profile',
      
      // Units
      'units.cm': 'cm',
      'units.lpm': 'L/min',
      'units.watts': 'W',
      'units.amps': 'A',
      'units.litres': 'L',
      'units.kwh': 'kWh',
      'units.seconds': 's',
    },
  },
  uz: {
    translation: {
      // Common
      'app.name': 'Suv Nazorati',
      'app.loading': 'Yuklanmoqda...',
      'app.error': 'Xato',
      'app.success': 'Muvaffaqiyatli',
      'app.confirm': 'Tasdiqlash',
      'app.cancel': 'Bekor qilish',
      'app.save': 'Saqlash',
      'app.delete': "O'chirish",
      'app.edit': 'Tahrirlash',
      'app.close': 'Yopish',
      'app.search': 'Qidirish',
      
      // Auth
      'auth.login': 'Kirish',
      'auth.logout': 'Chiqish',
      'auth.username': 'Foydalanuvchi nomi',
      'auth.password': 'Parol',
      'auth.loginBtn': 'Kirish',
      'auth.loginSuccess': 'Muvaffaqiyatli kirildi',
      'auth.loginError': "Noto'g'ri ma'lumotlar",
      'auth.required': 'Bu maydon talab qilinadi',
      
      // Dashboard
      'dashboard.title': 'Boshqaruv paneli',
      'dashboard.devices': 'Qurilmalar',
      'dashboard.online': 'Onlayn',
      'dashboard.offline': 'Oflayn',
      'dashboard.totalDevices': 'Jami qurilmalar',
      
      // Device
      'device.status': 'Holati',
      'device.online': 'Onlayn',
      'device.offline': 'Oflayn',
      'device.waterDepth': 'Suv chuqurligi',
      'device.height': 'Balandlik',
      'device.flowRate': 'Oqim tezligi',
      'device.power': 'Quvvat',
      'device.current': 'Tok',
      'device.motorState': 'Motor',
      'device.motorOn': 'Motor YONIQ',
      'device.motorOff': "Motor O'CHIQ",
      'device.timerRemaining': 'Taymer',
      'device.totalLitres': 'Jami litr',
      'device.energyUsed': 'Ishlatilgan energiya',
      
      // Controls
      'controls.title': 'Boshqaruv',
      'controls.motor': 'Motor boshqaruvi',
      'controls.timer': 'Taymer',
      'controls.height': 'Balandlik sozlash',
      'controls.turnOn': 'Yoqish',
      'controls.turnOff': "O'chirish",
      'controls.setTimer': "Taymerni o'rnatish",
      'controls.setHeight': 'Balandlikni sozlash',
      'controls.duration': 'Davomiyligi (soniya)',
      'controls.targetHeight': 'Maqsad balandligi (sm)',
      'controls.apply': "Qo'llash",
      'controls.success': "Buyruq muvaffaqiyatli yuborildi",
      'controls.error': "Buyruqni yuborishda xato",
      
      // Reports
      'reports.title': 'Hisobotlar',
      'reports.daily': 'Kunlik',
      'reports.monthly': 'Oylik',
      'reports.export': 'CSV ga eksport',
      'reports.date': 'Sana',
      'reports.deviceId': 'Qurilma',
      'reports.totalEnergy': 'Jami energiya',
      'reports.totalWater': 'Jami suv',
      
      // Settings
      'settings.title': 'Sozlamalar',
      'settings.language': 'Til',
      'settings.theme': 'Mavzu',
      'settings.profile': 'Profil',
      
      // Units
      'units.cm': 'sm',
      'units.lpm': 'L/daq',
      'units.watts': 'Vt',
      'units.amps': 'A',
      'units.litres': 'L',
      'units.kwh': 'kVt·soat',
      'units.seconds': 's',
    },
  },
  ru: {
    translation: {
      // Common
      'app.name': 'Контроль Воды',
      'app.loading': 'Загрузка...',
      'app.error': 'Ошибка',
      'app.success': 'Успешно',
      'app.confirm': 'Подтвердить',
      'app.cancel': 'Отмена',
      'app.save': 'Сохранить',
      'app.delete': 'Удалить',
      'app.edit': 'Редактировать',
      'app.close': 'Закрыть',
      'app.search': 'Поиск',
      
      // Auth
      'auth.login': 'Вход',
      'auth.logout': 'Выход',
      'auth.username': 'Имя пользователя',
      'auth.password': 'Пароль',
      'auth.loginBtn': 'Войти',
      'auth.loginSuccess': 'Вход выполнен успешно',
      'auth.loginError': 'Неверные учетные данные',
      'auth.required': 'Это поле обязательно',
      
      // Dashboard
      'dashboard.title': 'Панель управления',
      'dashboard.devices': 'Устройства',
      'dashboard.online': 'Онлайн',
      'dashboard.offline': 'Офлайн',
      'dashboard.totalDevices': 'Всего устройств',
      
      // Device
      'device.status': 'Статус',
      'device.online': 'Онлайн',
      'device.offline': 'Офлайн',
      'device.waterDepth': 'Глубина воды',
      'device.height': 'Высота',
      'device.flowRate': 'Расход',
      'device.power': 'Мощность',
      'device.current': 'Ток',
      'device.motorState': 'Мотор',
      'device.motorOn': 'Мотор ВКЛ',
      'device.motorOff': 'Мотор ВЫКЛ',
      'device.timerRemaining': 'Таймер',
      'device.totalLitres': 'Всего литров',
      'device.energyUsed': 'Использовано энергии',
      
      // Controls
      'controls.title': 'Управление',
      'controls.motor': 'Управление мотором',
      'controls.timer': 'Таймер',
      'controls.height': 'Настройка высоты',
      'controls.turnOn': 'Включить',
      'controls.turnOff': 'Выключить',
      'controls.setTimer': 'Установить таймер',
      'controls.setHeight': 'Установить высоту',
      'controls.duration': 'Длительность (секунды)',
      'controls.targetHeight': 'Целевая высота (см)',
      'controls.apply': 'Применить',
      'controls.success': 'Команда отправлена успешно',
      'controls.error': 'Ошибка отправки команды',
      
      // Reports
      'reports.title': 'Отчеты',
      'reports.daily': 'Ежедневные',
      'reports.monthly': 'Ежемесячные',
      'reports.export': 'Экспорт CSV',
      'reports.date': 'Дата',
      'reports.deviceId': 'Устройство',
      'reports.totalEnergy': 'Всего энергии',
      'reports.totalWater': 'Всего воды',
      
      // Settings
      'settings.title': 'Настройки',
      'settings.language': 'Язык',
      'settings.theme': 'Тема',
      'settings.profile': 'Профиль',
      
      // Units
      'units.cm': 'см',
      'units.lpm': 'л/мин',
      'units.watts': 'Вт',
      'units.amps': 'А',
      'units.litres': 'л',
      'units.kwh': 'кВт·ч',
      'units.seconds': 'с',
    },
  },
};

const savedLanguage = localStorage.getItem('lang') || 'uz';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
