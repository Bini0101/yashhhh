import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');
const chartWidth = width - 40;
const chartHeight = 200;

export function EnergyChart() {
  const { energyData, isDarkMode } = useAppState();

  if (!energyData.length) return null;

  const maxConsumption = Math.max(...energyData.map(d => d.consumption));
  const minConsumption = Math.min(...energyData.map(d => d.consumption));

  const createPath = () => {
    const stepX = chartWidth / (energyData.length - 1);
    let path = '';

    energyData.forEach((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point.consumption - minConsumption) / (maxConsumption - minConsumption)) * chartHeight;
      
      if (index === 0) {
        path += `M ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    return path;
  };

  const createAreaPath = () => {
    const stepX = chartWidth / (energyData.length - 1);
    let path = '';

    energyData.forEach((point, index) => {
      const x = index * stepX;
      const y = chartHeight - ((point.consumption - minConsumption) / (maxConsumption - minConsumption)) * chartHeight;
      
      if (index === 0) {
        path += `M ${x} ${chartHeight} L ${x} ${y}`;
      } else {
        path += ` L ${x} ${y}`;
      }
    });

    path += ` L ${chartWidth} ${chartHeight} Z`;
    return path;
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc' }]}>
      <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
        Consommation des 24 dernières heures
      </Text>
      
      <Svg height={chartHeight} width={chartWidth} style={styles.chart}>
        {/* Area gradient effect */}
        <Path
          d={createAreaPath()}
          fill="rgba(37, 99, 235, 0.1)"
          stroke="none"
        />
        
        {/* Main line */}
        <Path
          d={createPath()}
          stroke="#2563eb"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Data points */}
        {energyData.map((point, index) => {
          const stepX = chartWidth / (energyData.length - 1);
          const x = index * stepX;
          const y = chartHeight - ((point.consumption - minConsumption) / (maxConsumption - minConsumption)) * chartHeight;
          
          return (
            <Circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />
          );
        })}
      </Svg>

      <View style={styles.legend}>
        <Text style={[styles.legendText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
          Max: {maxConsumption}W | Min: {minConsumption}W
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
  },
  legend: {
    marginTop: 8,
    alignItems: 'center',
  },
  legendText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});