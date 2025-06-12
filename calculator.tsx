import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TextInput, TouchableOpacity } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { Calculator, Zap, TrendingUp, PiggyBank } from 'lucide-react-native';

export default function CalculatorScreen() {
  const { isDarkMode } = useAppState();
  
  const [dailyConsumption, setDailyConsumption] = useState('');
  const [tariffRate, setTariffRate] = useState('80'); // FCFA per kWh
  const [daysInMonth, setDaysInMonth] = useState('30');
  const [currentBill, setCurrentBill] = useState('');

  const calculatePrediction = () => {
    const daily = parseFloat(dailyConsumption) || 0;
    const rate = parseFloat(tariffRate) || 80;
    const days = parseFloat(daysInMonth) || 30;

    const monthlyConsumption = daily * days;
    const monthlyBill = monthlyConsumption * rate;
    
    return {
      monthlyConsumption,
      monthlyBill,
      dailyCost: daily * rate
    };
  };

  const calculateSavings = () => {
    const current = parseFloat(currentBill) || 0;
    const predicted = calculatePrediction().monthlyBill;
    const savings = current - predicted;
    const savingsPercent = current > 0 ? (savings / current) * 100 : 0;
    
    return { savings, savingsPercent };
  };

  const prediction = calculatePrediction();
  const savings = calculateSavings();

  const energyTips = [
    {
      title: 'Climatisation efficace',
      description: 'Réglez à 25°C au lieu de 18°C',
      potential: '30-40%',
      icon: '❄️'
    },
    {
      title: 'Éclairage LED',
      description: 'Remplacez les ampoules classiques',
      potential: '80%',
      icon: '💡'
    },
    {
      title: 'Veille des appareils',
      description: 'Débranchez les appareils non utilisés',
      potential: '10-15%',
      icon: '🔌'
    },
    {
      title: 'Réfrigérateur optimisé',
      description: 'Maintenez à 4°C (réfrigérateur) et -18°C (congélateur)',
      potential: '15-20%',
      icon: '🧊'
    }
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Calculator size={32} color="#2563eb" />
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
          Calculateur de Facture
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Formulaire de calcul */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Données de consommation
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              Consommation quotidienne (kWh)
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              value={dailyConsumption}
              onChangeText={setDailyConsumption}
              keyboardType="decimal-pad"
              placeholder="Ex: 15.5"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              Tarif CIE (FCFA/kWh)
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              value={tariffRate}
              onChangeText={setTariffRate}
              keyboardType="decimal-pad"
              placeholder="80"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              Jours dans le mois
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              value={daysInMonth}
              onChangeText={setDaysInMonth}
              keyboardType="number-pad"
              placeholder="30"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
          </View>
        </View>

        {/* Résultats de prédiction */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Prédiction mensuelle
          </Text>
          
          <View style={styles.resultGrid}>
            <View style={styles.resultCard}>
              <Zap size={24} color="#2563eb" />
              <Text style={[styles.resultValue, { color: '#2563eb' }]}>
                {prediction.monthlyConsumption.toFixed(1)} kWh
              </Text>
              <Text style={[styles.resultLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                Consommation
              </Text>
            </View>
            
            <View style={styles.resultCard}>
              <TrendingUp size={24} color="#16a34a" />
              <Text style={[styles.resultValue, { color: '#16a34a' }]}>
                {prediction.monthlyBill.toLocaleString()} FCFA
              </Text>
              <Text style={[styles.resultLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                Facture estimée
              </Text>
            </View>
          </View>

          <View style={styles.dailyCostContainer}>
            <Text style={[styles.dailyCostLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              Coût quotidien: {prediction.dailyCost.toLocaleString()} FCFA
            </Text>
          </View>
        </View>

        {/* Comparaison avec facture actuelle */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Comparaison avec votre facture
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              Votre dernière facture (FCFA)
            </Text>
            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              value={currentBill}
              onChangeText={setCurrentBill}
              keyboardType="decimal-pad"
              placeholder="Ex: 45000"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
            />
          </View>

          {currentBill && (
            <View style={[styles.savingsCard, {
              backgroundColor: savings.savings > 0 ? '#dcfce7' : '#fef2f2',
            }]}>
              <PiggyBank 
                size={24} 
                color={savings.savings > 0 ? '#16a34a' : '#dc2626'} 
              />
              <Text style={[styles.savingsValue, {
                color: savings.savings > 0 ? '#16a34a' : '#dc2626'
              }]}>
                {savings.savings > 0 ? '+' : ''}{savings.savings.toLocaleString()} FCFA
              </Text>
              <Text style={[styles.savingsLabel, {
                color: savings.savings > 0 ? '#16a34a' : '#dc2626'
              }]}>
                {savings.savings > 0 ? 'Économies' : 'Surcoût'} ({savings.savingsPercent.toFixed(1)}%)
              </Text>
            </View>
          )}
        </View>

        {/* Conseils d'économie */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            💡 Conseils d'économie
          </Text>
          
          {energyTips.map((tip, index) => (
            <View key={index} style={styles.tipCard}>
              <Text style={styles.tipIcon}>{tip.icon}</Text>
              <View style={styles.tipContent}>
                <Text style={[styles.tipTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
                  {tip.title}
                </Text>
                <Text style={[styles.tipDescription, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                  {tip.description}
                </Text>
              </View>
              <View style={styles.tipPotential}>
                <Text style={[styles.tipPotentialText, { color: '#16a34a' }]}>
                  -{tip.potential}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Simulateur de tarifs */}
        <View style={[styles.section, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            📊 Simulateur de tarifs
          </Text>
          
          <View style={styles.tariffGrid}>
            {[70, 80, 90, 100].map(rate => {
              const bill = prediction.monthlyConsumption * rate;
              return (
                <TouchableOpacity 
                  key={rate}
                  style={[styles.tariffCard, {
                    backgroundColor: rate.toString() === tariffRate ? '#2563eb' : 'transparent',
                  }]}
                  onPress={() => setTariffRate(rate.toString())}
                >
                  <Text style={[styles.tariffRate, {
                    color: rate.toString() === tariffRate ? '#ffffff' : (isDarkMode ? '#ffffff' : '#1f2937')
                  }]}>
                    {rate} FCFA/kWh
                  </Text>
                  <Text style={[styles.tariffBill, {
                    color: rate.toString() === tariffRate ? '#ffffff' : (isDarkMode ? '#9ca3af' : '#6b7280')
                  }]}>
                    {bill.toLocaleString()} FCFA
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
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
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
  },
  section: {
    margin: 20,
    marginBottom: 16,
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
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  resultGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  resultCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  resultValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginVertical: 8,
  },
  resultLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  dailyCostContainer: {
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(107, 114, 128, 0.2)',
  },
  dailyCostLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  savingsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  savingsValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginLeft: 12,
    flex: 1,
  },
  savingsLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(107, 114, 128, 0.1)',
  },
  tipIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  tipDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  tipPotential: {
    alignItems: 'center',
  },
  tipPotentialText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
  },
  tariffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  tariffCard: {
    width: '48%',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(107, 114, 128, 0.2)',
    marginBottom: 8,
    alignItems: 'center',
  },
  tariffRate: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  tariffBill: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});