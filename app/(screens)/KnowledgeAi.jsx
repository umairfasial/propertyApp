import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';

import SearchIcon from '../assets/icons/search.svg';
import ClockIcon from '../assets/icons/arrowClock.svg';

import InputField from '../components/ui/InputLabelField';
import CategoryButton from '../components/ui/CategoryButton';
import ArticleItem from '../components/ui/ArticleItem';

export default function KnowledgeAi() {
  const [searchText, setSearchText] = useState('');

  const categories = [{title: 'Articles'}, {title: 'Legal'}, {title: 'FAQ'}];

  const recentSearches = ['Privacy Policy', 'Terms of Service'];

  const popularArticles = [
    {
      title: 'How to protect your data online',
      updatedAt: '2 days ago',
      readTime: '5 min',
    },
    {
      title: 'GDPR Compliance Guidelines',
      updatedAt: '1 week ago',
      readTime: '8 min',
    },
    {
      title: 'Security Best Practices',
      updatedAt: '3 days ago',
      readTime: '6 min',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.searchContainer}>
        <InputField
          placeholder="Search knowledge base..."
          value={searchText}
          onChangeText={text => setSearchText(text)}
          containerStyle={styles.searchInput}
          icon={SearchIcon}
          inputContainerStyle={styles.searchInputContainer}
        />
      </View>

      <View style={styles.categoriesContainer}>
        {categories.map((category, index) => (
          <CategoryButton key={index} title={category.title} />
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.recentSearchesContainer}>
          {recentSearches.map((search, index) => (
            <View style={styles.textIconContainer}>
              <ClockIcon width={15} height={15} color="#00000" />
              <Text key={index} style={styles.recentSearchText}>
                {search}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Popular Articles</Text>
        {popularArticles.map((article, index) => (
          <ArticleItem
            key={index}
            title={article.title}
            updatedAt={article.updatedAt}
            readTime={article.readTime}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  searchContainer: {
    padding: 16,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 8,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

    marginBottom: 24,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  recentSearches: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  recentSearchesContainer: {
    paddingRight: 16,
    gap: 8,
    flexDirection: 'row',
  },
  textIconContainer: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  recentSearchText: {
    color: '#666',
  },
});
