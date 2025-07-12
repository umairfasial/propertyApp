import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import ThreeDotIcon from '../../assets/icons/threeDotsmenu.svg';
import ClipBoardIcon from '../../assets/icons/emptyClipBoard.svg';

const InspectionTemplateCard = ({title, subtitle, itemCount, onPress}) => {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.content}>
        <View style={styles.mainContent}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <View style={styles.itemCountContainer}>
            <ClipBoardIcon style={styles.itemIcon} />
            <Text style={styles.itemCount}>{itemCount} items</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <ThreeDotIcon style={styles.menuIcon} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  mainContent: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  itemCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 16,
    height: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
  },
  itemCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  menuButton: {
    padding: 4,
  },
  menuIcon: {
    width: 18,
    height: 18,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
  },
});

export default InspectionTemplateCard;
