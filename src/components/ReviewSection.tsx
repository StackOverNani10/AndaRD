import { useEffect, useState } from 'react';
import { Star, ThumbsUp, MessageCircle } from 'lucide-react';
import { supabase, Review } from '../lib/supabase';

interface ReviewSectionProps {
  eventId: string;
}

export function ReviewSection({ eventId }: ReviewSectionProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [eventId]);

  const fetchReviews = async () => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= rating
                ? 'fill-yellow-400 text-yellow-400'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-DO', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--verde-oscuro1)]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <MessageCircle className="w-8 h-8 text-[var(--verde-oscuro1)] sm:w-6 sm:h-6" />
          Reseñas y Consejos
        </h3>
        {reviews.length > 0 && (
          <div className="w-fit min-w-[120px] flex items-center justify-center bg-gradient-to-r from-green-50 to-green-100 px-3 py-2 rounded-xl border border-green-200">
            <div className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-[var(--verde-oscuro1)] text-[var(--verde-oscuro1)] flex-shrink-0" />
                <span className="text-lg font-bold text-gray-800">{averageRating}</span>
              </div>
              <span className="text-sm text-gray-600">({reviews.length > 99 ? '+99' : reviews.length} reseñas)</span>
            </div>
          </div>
        )}
      </div>

      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl">
          <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-600">No hay reseñas todavía</p>
          <p className="text-gray-500 text-sm mt-1">Sé el primero en compartir tu experiencia</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{review.author_name}</h4>
                  <p className="text-sm text-gray-500">{formatDate(review.created_at)}</p>
                </div>
                {renderStars(review.rating)}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{review.comment}</p>

              <div className="flex items-center gap-2 text-gray-600">
                <button className="flex items-center gap-2 px-4 py-2 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200">
                  <ThumbsUp className="w-4 h-4 text-[var(--verde-oscuro1)]" />
                  <span className="text-sm font-medium text-[var(--verde-oscuro2)]">
                    Útil ({review.helpful_count})
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
