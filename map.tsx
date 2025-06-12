import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { MapPin, Plus, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Zap } from 'lucide-react-native';

interface Report {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  status: 'pending' | 'in_progress' | 'resolved';
  timestamp: Date;
  type: 'outage' | 'maintenance' | 'emergency';
}

export default function MapScreen() {
  const { isDarkMode } = useAppState();
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: '1',
      title: 'Panne secteur Cocody',
      description: 'Coupure générale depuis 14h',
      location: 'Cocody Riviera',
      coordinates: { lat: 5.3599, lng: -3.9877 },
      status: 'in_progress',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      type: 'outage'
    },
    {
      id: '2',
      title: 'Maintenance programmée',
      description: 'Travaux sur le réseau moyenne tension',
      location: 'Plateau Centre',
      coordinates: { lat: 5.3164, lng: -4.0282 },
      status: 'pending',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      type: 'maintenance'
    }
  ]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    location: '',
    type: 'outage' as 'outage' | 'maintenance' | 'emergency'
  });

  const handleAddReport = () => {
    if (!newReport.title || !newReport.description || !newReport.location) {
      return;
    }

    const report: Report = {
      id: Date.now().toString(),
      ...newReport,
      coordinates: { lat: 5.3 + Math.random() * 0.2, lng: -4.0 + Math.random() * 0.2 },
      status: 'pending',
      timestamp: new Date()
    };

    setReports(prev => [report, ...prev]);
    setNewReport({ title: '', description: '', location: '', type: 'outage' });
    setShowReportModal(false);
  };

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return <Clock size={20} color="#f59e0b" />;
      case 'in_progress':
        return <AlertTriangle size={20} color="#dc2626" />;
      case 'resolved':
        return <CheckCircle size={20} color="#16a34a" />;
    }
  };

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'in_progress':
        return 'En cours';
      case 'resolved':
        return 'Résolu';
    }
  };

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'outage':
        return <Zap size={20} color="#dc2626" />;
      case 'maintenance':
        return <AlertTriangle size={20} color="#f59e0b" />;
      case 'emergency':
        return <AlertTriangle size={20} color="#dc2626" />;
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffHours > 0) {
      return `Il y a ${diffHours}h`;
    } else if (diffMinutes > 0) {
      return `Il y a ${diffMinutes}min`;
    } else {
      return 'À l\'instant';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
            Carte Communautaire
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Signalements et pannes réseau
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#2563eb' }]}
          onPress={() => setShowReportModal(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Carte simulée */}
      <View style={[styles.mapContainer, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
        <View style={styles.mapPlaceholder}>
          <MapPin size={48} color="#2563eb" />
          <Text style={[styles.mapText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Carte interactive Abidjan
          </Text>
          <Text style={[styles.mapSubtext, { color: isDarkMode ? '#6b7280' : '#9ca3af' }]}>
            {reports.length} signalement{reports.length > 1 ? 's' : ''} actif{reports.length > 1 ? 's' : ''}
          </Text>
        </View>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <AlertTriangle size={20} color="#dc2626" />
          <Text style={[styles.statValue, { color: '#dc2626' }]}>
            {reports.filter(r => r.status === 'in_progress').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            En cours
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Clock size={20} color="#f59e0b" />
          <Text style={[styles.statValue, { color: '#f59e0b' }]}>
            {reports.filter(r => r.status === 'pending').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            En attente
          </Text>
        </View>
        
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <CheckCircle size={20} color="#16a34a" />
          <Text style={[styles.statValue, { color: '#16a34a' }]}>
            {reports.filter(r => r.status === 'resolved').length}
          </Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Résolus
          </Text>
        </View>
      </View>

      {/* Liste des signalements */}
      <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
          Signalements récents
        </Text>
        
        {reports.map(report => (
          <View key={report.id} style={[styles.reportCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
            <View style={styles.reportHeader}>
              <View style={styles.reportTitleContainer}>
                {getTypeIcon(report.type)}
                <Text style={[styles.reportTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
                  {report.title}
                </Text>
              </View>
              <View style={styles.reportStatus}>
                {getStatusIcon(report.status)}
                <Text style={[styles.reportStatusText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                  {getStatusText(report.status)}
                </Text>
              </View>
            </View>
            
            <Text style={[styles.reportDescription, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
              {report.description}
            </Text>
            
            <View style={styles.reportFooter}>
              <View style={styles.reportLocation}>
                <MapPin size={16} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
                <Text style={[styles.reportLocationText, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
                  {report.location}
                </Text>
              </View>
              <Text style={[styles.reportTime, { color: isDarkMode ? '#6b7280' : '#9ca3af' }]}>
                {getTimeAgo(report.timestamp)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal de signalement */}
      <Modal
        visible={showReportModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowReportModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
              Nouveau signalement
            </Text>

            <View style={styles.typeSelector}>
              {[
                { key: 'outage', label: 'Panne', icon: <Zap size={20} color="#dc2626" /> },
                { key: 'maintenance', label: 'Maintenance', icon: <AlertTriangle size={20} color="#f59e0b" /> },
                { key: 'emergency', label: 'Urgence', icon: <AlertTriangle size={20} color="#dc2626" /> }
              ].map(type => (
                <TouchableOpacity
                  key={type.key}
                  style={[
                    styles.typeButton,
                    {
                      backgroundColor: newReport.type === type.key ? '#2563eb' : 'transparent',
                      borderColor: newReport.type === type.key ? '#2563eb' : (isDarkMode ? '#4b5563' : '#d1d5db')
                    }
                  ]}
                  onPress={() => setNewReport(prev => ({ ...prev, type: type.key as any }))}
                >
                  {type.icon}
                  <Text style={[
                    styles.typeButtonText,
                    { color: newReport.type === type.key ? '#ffffff' : (isDarkMode ? '#ffffff' : '#1f2937') }
                  ]}>
                    {type.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Titre du signalement"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newReport.title}
              onChangeText={(text) => setNewReport(prev => ({ ...prev, title: text }))}
            />

            <TextInput
              style={[styles.input, styles.textArea, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Description détaillée"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newReport.description}
              onChangeText={(text) => setNewReport(prev => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Localisation (quartier, rue...)"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newReport.location}
              onChangeText={(text) => setNewReport(prev => ({ ...prev, location: text }))}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6b7280' }]}
                onPress={() => setShowReportModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#2563eb' }]}
                onPress={handleAddReport}
              >
                <Text style={styles.modalButtonText}>Signaler</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  addButton: {
    borderRadius: 12,
    padding: 12,
  },
  mapContainer: {
    margin: 20,
    borderRadius: 12,
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginTop: 8,
  },
  mapSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  reportsList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  reportCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  reportTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 8,
    flex: 1,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reportStatusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  reportDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportLocationText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    marginLeft: 4,
  },
  reportTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  typeSelector: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 2,
  },
  typeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  modalButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    textAlign: 'center',
  },
});