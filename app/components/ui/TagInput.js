import React, {useState} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';

const TagInput = ({tags, setTags}) => {
  const [inputValue, setInputValue] = useState('');

  const handleAddTag = () => {
    const trimmed = inputValue.trim().toUpperCase();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
    }
    setInputValue('');
  };

  const removeTag = index => {
    const updatedTags = [...tags];
    updatedTags.splice(index, 1);
    setTags(updatedTags);
  };

  return (
    <View style={styles.container}>
      {tags.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tagWrapper}>
          {tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
              <TouchableOpacity
                onPress={() => removeTag(index)}
                style={styles.iconContainer}>
                <Text style={{color: '#fff'}}>x</Text>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      <TextInput
        style={styles.input}
        placeholder="Type and press enter..."
        value={inputValue}
        onChangeText={text => setInputValue(text.toUpperCase())}
        onSubmitEditing={handleAddTag}
        returnKeyType="done"
        autoCapitalize="characters"
      />
    </View>
  );
};

export default TagInput;

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  tagWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 4,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563EB',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 13,
    marginRight: 6,
  },
  iconContainer: {
    padding: 2,
  },
  iconCircle: {
    backgroundColor: '#fff',
    borderRadius: 100,
    height: 25,
    width: 25,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 10,
    borderRadius: 8,
    marginTop: 8,
  },
});
