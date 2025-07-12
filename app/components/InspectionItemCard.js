import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import InspectionItemComponent from './InspectionItemComponent';
import ThreeDotIcon from '../assets/icons/threeDotsmenu.svg';
import RatingIcon from '../assets/icons/starIcon.svg';
import PhotoIcon from '../assets/icons/camera.svg';
import NoteIcon from '../assets/icons/noteIcon.svg';
import VideoIcon from '../assets/icons/videoCamera.svg';
import ReportIcon from '../assets/icons/issues.svg';

const iconMap = {
  'Add Photo': PhotoIcon,
  'Add Note': NoteIcon,
  Rating: RatingIcon,
  Record: VideoIcon,
  'Report Issue': ReportIcon,
};

export default function InspectionItemCard({title, description, fields = []}) {
  // Filter only fields where value is truthy
  const activeFields = fields.filter(f => f.value);

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>{title}</Text>
        <ThreeDotIcon style={styles.placeholderIcon} />
      </View>
      <Text style={styles.description}>{description}</Text>

      {Array.from({length: Math.ceil(activeFields.length / 2)}).map(
        (_, rowIndex) => (
          <View style={styles.actionsRow} key={rowIndex}>
            {activeFields
              .slice(rowIndex * 2, rowIndex * 2 + 2)
              .map((field, i) => {
                const Icon = iconMap[field.label];
                return Icon ? (
                  <InspectionItemComponent
                    key={field.label + i}
                    title={field.label}
                    icon={Icon}
                    isWarning={field.label === 'Report Issue'}
                  />
                ) : null;
              })}
          </View>
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: '#eee',
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter',
  },
  description: {
    color: '#666',
    fontSize: 14,
    fontFamily: 'Inter',
    marginBottom: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  placeholderIcon: {
    width: 20,
    height: 20,
    color: '#000',
    borderRadius: 10,
  },
});
