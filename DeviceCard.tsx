import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { 
  Refrigerator, 
  Wind, 
  Tv, 
  Lightbulb, 
  Microwave, 
  WashingMachine, 
  Power 
} from 'lucide-react-native';

interface Device {
  id: string;
  name: string;
  type: string;
  consumption: number;
  status: 'on' | 'off' | 'standby';
  room: string;
  icon: string;
}

interface DeviceCardProps {
  device: Device;
  onToggle: (id: string) => void;
}

export function DeviceCard({ device, onToggle }: DeviceCardProps) {
  const { isDarkMode } = useAppState();

  const getIcon = () => {
    const iconProps = { 
      size: 24, 
      color: device.status === 'on' ? '#16a34a' : '#6b7280' 
    };

    switch (device.icon) {
      case 'refrigerator':
        return <Refrigerator {...iconProps} />;
      case 'wind':
        return <Wind {...iconProps} />;
      case 'tv':
        return <Tv {...iconProps} />;
      case 'lightbulb':
        return <Lightbulb {...iconProps} />;
      case 'microwave':
        return <Microwave {...iconProps} />;
      case 'washing-machine':
        return <WashingMachine {...iconProps} />;
      default:
        return <Power {...iconProps} />;
    }
  };

  const getStatusColor = () => {
    switch (device.status) {
      case 'on':
        return '#16a34a';
      case 'off':
        return '#6b7280';
      case 'standby':
        return '#f59e0b';
    }
  };

  const getStatusText = () => {
    switch (device.status) {
      case 'on':
        return 'Allumé';
      case 'off':
        return 'Éteint';
      case 'standby':
        return 'En veille';
    }
  };

  return (
    <TouchableOpacity 
      style={[
        styles.container, 
        { 
          backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
          borderColor: device.status === 'on' ? '#16a34a' : (isDarkMode ? '#374151' : '#e5e7eb'),
          borderWidth: device.status === 'on' ? 2 : 1,
        }
      ]}
      onPress={() => onToggle(device.id)}
    >
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
      </View>
      
      <Text style={[styles.name, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
        {device.name}
      </Text>
      
      <Text style={[styles.room, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
        {device.room}
      </Text>
      
      <View style={styles.footer}>
        <Text style={[styles.consumption, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
          {device.consumption}W
        </Text>
        <Text style={[styles.status, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconContainer: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  name: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  room: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  consumption: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
  status: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    textTransform: 'uppercase',
  },
});