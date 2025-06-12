import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { Zap, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react-native';

interface EnergyWidgetProps {
  title: string;
  value: string;
  subtitle?: string;
  type: 'consumption' | 'cost' | 'alert';
  trend?: 'up' | 'down';
}

export function EnergyWidget({ title, value, subtitle, type, trend }: EnergyWidgetProps) {
  const { isDarkMode } = useAppState();

  const getIcon = () => {
    switch (type) {
      case 'consumption':
        return <Zap size={24} color="#2563eb" />;
      case 'cost':
        return <TrendingUp size={24} color="#16a34a" />;
      case 'alert':
        return <AlertTriangle size={24} color="#dc2626" />;
    }
  };

  const getBackgroundColor = () => {
    if (isDarkMode) {
      return type === 'alert' ? '#7f1d1d' : '#1f2937';
    }
    return type === 'alert' ? '#fef2f2' : '#ffffff';
  };

  return (
    <View style={[styles.container, { backgroundColor: getBackgroundColor() }]}>
      <View style={styles.header}>
        {getIcon()}
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
          {title}
        </Text>
      </View>
      
      <Text style={[styles.value, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
        {value}
      </Text>
      
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            {subtitle}
          </Text>
          {trend && (
            <TrendingUp 
              size={16} 
              color={trend === 'up' ? '#dc2626' : '#16a34a'} 
              style={{ transform: [{ rotate: trend === 'down' ? '180deg' : '0deg' }] }}
            />
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    margin: 8,
    flex: 1,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginLeft: 8,
  },
  value: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});