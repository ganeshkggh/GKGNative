import React, {useState, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Alert,
  Dimensions,
  TouchableOpacity,
  TextInput,
} from 'react-native';

interface Movie {
  id: number;
  original_title: string;
  release_date: string;
  overview: string;
  poster_path: string;
}

const API_URL = 'https://jsonfakery.com/movies/paginated';
const {width: screenWidth} = Dimensions.get('window');

const DashboardScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchMovies = useCallback(async (isRefresh = false) => {
    const currentPage = isRefresh ? 1 : page;
    if (isLoading || (!hasMore && !isRefresh)) return;

    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      const response = await fetch(`${API_URL}?page=${currentPage}`);
      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      if (currentPage === 1) {
        setFeaturedMovies(data.data.slice(0, 10));
      }

      setMovies(prevMovies => isRefresh ? data.data : [...prevMovies, ...data.data]);
      setPage(currentPage + 1);
      setHasMore(data.current_page < data.last_page);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      Alert.alert('Error', `Failed to fetch movies: ${message}`);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    fetchMovies();
  }, []); // Initial fetch

  const handleRefresh = () => {
    fetchMovies(true);
  };

  const renderFooter = () => {
    if (!isLoading || isRefreshing) return null;
    return <ActivityIndicator style={{marginVertical: 20}} />;
  };

  const renderViewPagerItem = ({item}: {item: Movie}) => (
    <View style={styles.viewPagerItem}>
      <Image source={{uri: item.poster_path}} style={styles.viewPagerImage} resizeMode="cover" />
      <View style={styles.viewPagerTitleContainer}>
        <Text style={styles.viewPagerTitle}>{item.original_title}</Text>
      </View>
    </View>
  );

  const renderMovieItem = ({item}: {item: Movie}) => (
    <TouchableOpacity onPress={() => navigation.navigate('MovieDetail', { movie: item })}>
      <View style={styles.movieItem}>
        <Image source={{uri: item.poster_path}} style={styles.poster} />
        <View style={styles.movieDetails}>
          <Text style={styles.title}>{item.original_title}</Text>
          <Text style={styles.details}>Released: {item.release_date}</Text>
          <Text style={styles.details} numberOfLines={3}>{item.overview}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const filteredMovies = useMemo(() => {
    if (!searchQuery) {
      return movies;
    }
    return movies.filter(movie =>
      movie.original_title.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [movies, searchQuery]);

  return (
    <View style={styles.container}>
      <View style={styles.viewPagerContainer}>
        <FlatList
          data={featuredMovies}
          renderItem={renderViewPagerItem}
          keyExtractor={item => `featured-${item.id.toString()}`}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        />
      </View>
      <FlatList
        data={filteredMovies}
        renderItem={renderMovieItem}
        keyExtractor={item => item.id.toString()}
        onEndReached={() => {
          if (!searchQuery) {
            fetchMovies();
          }
        }}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        onRefresh={handleRefresh}
        refreshing={isRefreshing}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <>
            <TextInput
              style={styles.searchInput}
              placeholder="Search movies..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            <Text style={styles.listHeader}>All Movies</Text>
          </>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  viewPagerContainer: {
    height: 250,
    marginBottom: 10,
  },
  viewPagerItem: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewPagerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  viewPagerTitleContainer: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
  },
  viewPagerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  movieItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 10,
  },
  searchInput: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  listHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  poster: {
    width: 80,
    height: 120,
    borderRadius: 4,
    marginRight: 10,
  },
  movieDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  details: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default DashboardScreen;