import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

export default function DashboardSection({title, items, iconsComponent}) {
  return (
    <ScrollView>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.container, iconsComponent && styles.row]}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.item, iconsComponent && styles.iconItem]}
              onPress={item.clicked}>
              {iconsComponent ? (
                <>
                  <View
                    style={[
                      styles.iconContainer,
                      {backgroundColor: item.iconBackground},
                    ]}>
                    {item.icon}
                  </View>
                  <Text style={styles.iconLabel}>{item.label}</Text>
                </>
              ) : (
                <>
                  <View style={styles.textRow}>
                    <View
                      style={[
                        styles.iconContainer,
                        {backgroundColor: item.iconBackground},
                      ]}>
                      {item.icon}
                    </View>
                    <View>
                      <View style={styles.row}>
                        <Text style={styles.activityTitle}>{item.title}</Text>
                        <Text style={[styles.time, {marginLeft: 10}]}>
                          {item.time}
                        </Text>
                      </View>

                      <Text style={styles.subtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                </>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    margin: 20,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 18,
    fontFamily: 'Inter',
    color: '#1F2937',
    marginBottom: 25,
  },
  container: {
    flexDirection: 'column',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    paddingTop: 20,
    padding: 5,
    borderRadius: 10,
    marginBottom: 10,
  },
  iconItem: {
    alignItems: 'center',
    flex: 1,
  },
  iconLabel: {
    marginTop: 5,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 12,
    fontFamily: 'Inter',
    color: '#4B5563',
    textAlign: 'center',
  },
  textRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  iconContainer: {
    width: 45,
    height: 45,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5E7EB',
  },

  activityTitle: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 14,
    fontFamily: 'Inter',
    color: '#1F2937',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontFamily: 'Inter',
    fontWeight: '400',
    lineHeight: 12,
    color: '#6B7280',
  },
  time: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
