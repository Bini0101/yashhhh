import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import { useAppState } from '@/contexts/AppStateContext';
import { DeviceCard } from '@/components/DeviceCard';
import { Plus, Search, Filter } from 'lucide-react-native';

export default function DevicesScreen() {
  const { 
    isDarkMode, 
    devices, 
    updateDevice, 
    removeDevice, 
    addDevice 
  } = useAppState();

  const [searchText, setSearchText] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    type: 'appliance',
    consumption: 0,
    room: '',
    icon: 'power'
  });

  const filteredDevices = devices.filter(device =>
    device.name.toLowerCase().includes(searchText.toLowerCase()) ||
    device.room.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleToggleDevice = (id: string) => {
    const device = devices.find(d => d.id === id);
    if (device) {
      const newStatus = device.status === 'on' ? 'off' : 'on';
      updateDevice(id, { status: newStatus });
    }
  };

  const handleAddDevice = () => {
    if (!newDevice.name || !newDevice.room || newDevice.consumption <= 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    addDevice({
      ...newDevice,
      status: 'off'
    });

    setNewDevice({
      name: '',
      type: 'appliance',
      consumption: 0,
      room: '',
      icon: 'power'
    });
    setShowAddModal(false);
  };

  const devicesByRoom = filteredDevices.reduce((acc, device) => {
    if (!acc[device.room]) {
      acc[device.room] = [];
    }
    acc[device.room].push(device);
    return acc;
  }, {} as Record<string, typeof devices>);

  const totalConsumption = devices
    .filter(d => d.status === 'on')
    .reduce((sum, d) => sum + d.consumption, 0);

  const activeDevices = devices.filter(d => d.status === 'on').length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
          Mes Appareils
        </Text>
        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: '#2563eb' }]}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      {/* Statistiques rapides */}
      <View style={styles.statsContainer}>
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.statValue, { color: '#2563eb' }]}>{activeDevices}</Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Appareils actifs
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
          <Text style={[styles.statValue, { color: '#16a34a' }]}>{totalConsumption}W</Text>
          <Text style={[styles.statLabel, { color: isDarkMode ? '#9ca3af' : '#6b7280' }]}>
            Consommation totale
          </Text>
        </View>
      </View>

      {/* Barre de recherche */}
      <View style={[styles.searchContainer, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
        <Search size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
        <TextInput
          style={[styles.searchInput, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}
          placeholder="Rechercher un appareil..."
          placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity>
          <Filter size={20} color={isDarkMode ? '#9ca3af' : '#6b7280'} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {Object.entries(devicesByRoom).map(([room, roomDevices]) => (
          <View key={room} style={styles.roomSection}>
            <Text style={[styles.roomTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
              {room}
            </Text>
            {roomDevices.map(device => (
              <DeviceCard
                key={device.id}
                device={device}
                onToggle={handleToggleDevice}
              />
            ))}
          </View>
        ))}
      </ScrollView>

      {/* Modal d'ajout d'appareil */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: isDarkMode ? '#1f2937' : '#ffffff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#ffffff' : '#1f2937' }]}>
              Ajouter un appareil
            </Text>

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Nom de l'appareil"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newDevice.name}
              onChangeText={(text) => setNewDevice(prev => ({ ...prev, name: text }))}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Pièce"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newDevice.room}
              onChangeText={(text) => setNewDevice(prev => ({ ...prev, room: text }))}
            />

            <TextInput
              style={[styles.input, { 
                backgroundColor: isDarkMode ? '#374151' : '#f9fafb',
                color: isDarkMode ? '#ffffff' : '#1f2937',
                borderColor: isDarkMode ? '#4b5563' : '#d1d5db'
              }]}
              placeholder="Consommation (W)"
              placeholderTextColor={isDarkMode ? '#9ca3af' : '#6b7280'}
              value={newDevice.consumption.toString()}
              onChangeText={(text) => setNewDevice(prev => ({ ...prev, consumption: parseInt(text) || 0 }))}
              keyboardType="numeric"
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#6b7280' }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.modalButtonText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#2563eb' }]}
                onPress={handleAddDevice}
              >
                <Text style={styles.modalButtonText}>Ajouter</Text>
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
  addButton: {
    borderRadius: 12,
    padding: 12,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  roomSection: {
    marginBottom: 24,
  },
  roomTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    marginLeft: 4,
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
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 20,
    textAlign: 'center',
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