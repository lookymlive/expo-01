import { View, Text, StyleSheet, FlatList, Image, Dimensions } from 'react-native';
import { useAuth } from '../../context/auth';
import { Ionicons } from '@expo/vector-icons';

const WINDOW_HEIGHT = Dimensions.get('window').height;

export default function FeedScreen() {
  const { user } = useAuth();

  interface Video {
    id: string;
    title: string;
    business: string;
    description: string;
    likes: number;
    comments: number;
    imageUrl: string;
  }
  
  const videos: Video[] = [
    {
      id: '1',
      title: 'Café artesanal',
      business: 'Café del Centro',
      description: 'Descubre nuestro proceso de tostado artesanal ☕',
      likes: 1200,
      comments: 45,
      imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
    },
    {
      id: '2',
      title: 'Postres especiales',
      business: 'Dulce Pastelería',
      description: '¡Nuevos postres cada día! 🍰',
      likes: 850,
      comments: 32,
      imageUrl: 'https://images.unsplash.com/photo-1488477181946-6428a0291777',
    },
  ];

  const renderPost = ({ item }: { item: Video }) => (
    <View style={styles.postContainer}>
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        resizeMode="cover"
      />
      
      <View style={styles.postOverlay}>
        <View style={styles.postInfo}>
          <Text style={styles.businessName}>{item.business}</Text>
          <Text style={styles.description}>{item.description}</Text>
        </View>
        
        <View style={styles.interactions}>
          <View style={styles.interactionItem}>
            <Ionicons name="heart-outline" size={28} color="white" />
            <Text style={styles.interactionText}>{item.likes}</Text>
          </View>
          <View style={styles.interactionItem}>
            <Ionicons name="chatbubble-outline" size={28} color="white" />
            <Text style={styles.interactionText}>{item.comments}</Text>
          </View>
          <View style={styles.interactionItem}>
            <Ionicons name="share-social-outline" size={28} color="white" />
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={videos}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        snapToInterval={WINDOW_HEIGHT}
        snapToAlignment="start"
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  postContainer: {
    height: WINDOW_HEIGHT,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
  },
  postOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  postInfo: {
    flex: 1,
    marginRight: 20,
  },
  businessName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  interactions: {
    alignItems: 'center',
  },
  interactionItem: {
    alignItems: 'center',
    marginBottom: 16,
  },
  interactionText: {
    color: '#fff',
    marginTop: 4,
  },
});