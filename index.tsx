import React from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { EnergyChart } from '@/components/EnergyChart';
import { EnergyWidget } from '@/components/EnergyWidget';
import { Bell, Sun, Moon } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native';

export default function Dashboard() {
  const { 
    isDarkMode, 
    toggleTheme, 
    currentConsumption, 
    monthlyBudget,
    alerts,
    energyData 
  } = useAppState();

  const todayConsumption = energyData.reduce((sum, data) => sum + data.consumption, 0);
  const todayCost = Math.round(todayConsumption * 0.08); // 80 FCFA/kWh
  const budgetUsage = (todayCost / monthlyBudget) * 100;

  const unreadAlerts = alerts.filter(alert => !alert.isRead).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Bonjour ! 👋
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Voici votre consommation d'énergie
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.iconButton}
            onPress={toggleTheme}
          >
            {isDarkMode ? (
              <Sun size={24} color="#f59e0b" />
            ) : (
              <Moon size={24} color="#6b7280" />
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.iconButton}>
            <Bell size={24} color={isDarkMode ? '#ffffff' : '#1f2937'} />
            {unreadAlerts > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadAlerts}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Consommation actuelle */}
        <View style={styles.currentConsumption}>
          <Text style={[styles.currentTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Consommation actuelle
          </Text>
          <Text style={[styles.currentValue, { color: '#2563eb' }]}>
            {currentConsumption.toLocaleString()} W
          </Text>
          <Text style={[styles.currentCost, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            ≈ {Math.round(currentConsumption * 0.08)} FCFA/h
          </Text>
        </View>

        {/* Widgets d'énergie */}
        <View style={styles.widgetsContainer}>
          <EnergyWidget
            title="Aujourd'hui"
            value={`${Math.round(todayConsumption / 1000)} kWh`}
            subtitle={`${todayCost.toLocaleString()} FCFA`}
            type="consumption"
            trend="up"
          />
          <EnergyWidget
            title="Budget"
            value={`${budgetUsage.toFixed(1)}%`}
            subtitle={`${(monthlyBudget - todayCost).toLocaleString()} FCFA restant`}
            type="cost"
            trend={budgetUsage > 80 ? 'up' : 'down'}
          />
        </View>

        {/* Graphique */}
        <EnergyChart />

        {/* Alertes récents */}
        {alerts.length > 0 && (
          <View style={[styles.alertsSection, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
            <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
              Alertes récentes
            </Text>
            {alerts.slice(0, 3).map(alert => (
              <View key={alert.id} style={styles.alertItem}>
                <View style={[styles.alertDot, { backgroundColor: alert.type === 'warning' ? '#f59e0b' : '#dc2626' }]} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
                    {alert.title}
                  </Text>
                  <Text style={[styles.alertMessage, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                    {alert.message}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Conseils d'économie */}
        <View style={[styles.tipsSection, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            💡 Conseils d'économie
          </Text>
          <Text style={[styles.tipText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            • Éteignez les appareils en veille pour économiser jusqu'à 15% sur votre facture
          </Text>
          <Text style={[styles.tipText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            • Utilisez la climatisation à 25°C plutôt qu'à 18°C
          </Text>
          <Text style={[styles.tipText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            • Privilégiez les heures creuses pour vos gros électroménagers
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#dc2626',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  currentConsumption: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  currentTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  currentValue: {
    fontSize: 48,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  currentCost: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  widgetsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  alertsSection: {
    margin: 20,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipsSection: {
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  alertDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  tipText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 8,
  },
});