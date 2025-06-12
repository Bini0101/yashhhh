import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Appearance } from 'react-native';

interface EnergyData {
  id: string;
  timestamp: Date;
  consumption: number;
  cost: number;
  device?: string;
}

interface Device {
  id: string;
  name: string;
  type: string;
  consumption: number;
  status: 'on' | 'off' | 'standby';
  room: string;
  icon: string;
}

interface Alert {
  id: string;
  type: 'warning' | 'danger' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

interface AppState {
  isDarkMode: boolean;
  toggleTheme: () => void;
  energyData: EnergyData[];
  devices: Device[];
  alerts: Alert[];
  currentConsumption: number;
  monthlyBudget: number;
  setMonthlyBudget: (budget: number) => void;
  addDevice: (device: Omit<Device, 'id'>) => void;
  updateDevice: (id: string, updates: Partial<Device>) => void;
  removeDevice: (id: string) => void;
  markAlertAsRead: (id: string) => void;
}

const AppStateContext = createContext<AppState | undefined>(undefined);

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [monthlyBudget, setMonthlyBudget] = useState(50000); // FCFA
  
  // Données simulées
  const [energyData, setEnergyData] = useState<EnergyData[]>([]);
  const [devices, setDevices] = useState<Device[]>([
    {
      id: '1',
      name: 'Réfrigérateur',
      type: 'appliance',
      consumption: 150,
      status: 'on',
      room: 'Cuisine',
      icon: 'refrigerator'
    },
    {
      id: '2',
      name: 'Climatiseur Salon',
      type: 'cooling',
      consumption: 1200,
      status: 'off',
      room: 'Salon',
      icon: 'wind'
    },
    {
      id: '3',
      name: 'Téléviseur',
      type: 'entertainment',
      consumption: 80,
      status: 'on',
      room: 'Salon',
      icon: 'tv'
    }
  ]);
  
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'warning',
      title: 'Consommation élevée',
      message: 'Votre consommation dépasse 80% de votre budget mensuel.',
      timestamp: new Date(),
      isRead: false
    }
  ]);

  const currentConsumption = devices
    .filter(d => d.status === 'on')
    .reduce((sum, d) => sum + d.consumption, 0);

  useEffect(() => {
    const colorScheme = Appearance.getColorScheme();
    setIsDarkMode(colorScheme === 'dark');

    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setIsDarkMode(colorScheme === 'dark');
    });

    return () => subscription?.remove();
  }, []);

  // Générer des données énergétiques simulées
  useEffect(() => {
    const generateEnergyData = () => {
      const data: EnergyData[] = [];
      const now = new Date();
      
      for (let i = 23; i >= 0; i--) {
        const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
        const baseConsumption = Math.sin((24 - i) / 24 * Math.PI * 2) * 500 + 800;
        const consumption = Math.max(200, baseConsumption + Math.random() * 300);
        
        data.push({
          id: `${i}`,
          timestamp,
          consumption: Math.round(consumption),
          cost: Math.round(consumption * 0.08) // 80 FCFA/kWh approximativement
        });
      }
      
      setEnergyData(data);
    };

    generateEnergyData();
    const interval = setInterval(generateEnergyData, 30000); // Update every 30s

    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const addDevice = (device: Omit<Device, 'id'>) => {
    const newDevice = {
      ...device,
      id: Date.now().toString()
    };
    setDevices(prev => [...prev, newDevice]);
  };

  const updateDevice = (id: string, updates: Partial<Device>) => {
    setDevices(prev => 
      prev.map(device => 
        device.id === id ? { ...device, ...updates } : device
      )
    );
  };

  const removeDevice = (id: string) => {
    setDevices(prev => prev.filter(device => device.id !== id));
  };

  const markAlertAsRead = (id: string) => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === id ? { ...alert, isRead: true } : alert
      )
    );
  };

  const contextValue: AppState = {
    isDarkMode,
    toggleTheme,
    energyData,
    devices,
    alerts,
    currentConsumption,
    monthlyBudget,
    setMonthlyBudget,
    addDevice,
    updateDevice,
    removeDevice,
    markAlertAsRead
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
}