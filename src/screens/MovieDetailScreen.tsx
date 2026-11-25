import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

const MovieDetailScreen: React.FC<{ route: any }> = ({ route }) => {
  const { movie } = route.params;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.poster_path }} style={styles.poster} />
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{movie.original_title}</Text>
        <Text style={styles.releaseDate}>Released: {movie.release_date}</Text>
        <Text style={styles.overviewHeader}>Overview</Text>
        <Text style={styles.overview}>{movie.overview}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  poster: {
    width: '100%',
    height: 400,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  releaseDate: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  overviewHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  overview: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
});

export default MovieDetailScreen;
