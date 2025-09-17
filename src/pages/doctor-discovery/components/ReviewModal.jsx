import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ReviewModal = ({ isOpen, onClose, doctor, reviews }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  if (!isOpen || !doctor) return null;

  const totalPages = Math.ceil(reviews?.length / reviewsPerPage);
  const startIndex = (currentPage - 1) * reviewsPerPage;
  const currentReviews = reviews?.slice(startIndex, startIndex + reviewsPerPage);

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars?.push(
        <Icon key={i} name="Star" size={14} color="var(--color-warning)" className="fill-current" />
      );
    }

    if (hasHalfStar) {
      stars?.push(
        <Icon key="half" name="StarHalf" size={14} color="var(--color-warning)" className="fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars?.push(
        <Icon key={`empty-${i}`} name="Star" size={14} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews?.forEach(review => {
      distribution[Math.floor(review.rating)]++;
    });
    return distribution;
  };

  const ratingDistribution = getRatingDistribution();
  const totalReviews = reviews?.length;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                <Image
                  src={doctor?.photo}
                  alt={`Dr. ${doctor?.name}`}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">
                  Reseñas de Dr. {doctor?.name}
                </h2>
                <p className="text-sm text-muted-foreground">{doctor?.specialty}</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row max-h-[calc(90vh-80px)]">
          {/* Rating Summary */}
          <div className="lg:w-1/3 p-6 border-b lg:border-b-0 lg:border-r border-border">
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-foreground mb-2">
                {doctor?.rating}
              </div>
              <div className="flex items-center justify-center space-x-1 mb-2">
                {renderStars(doctor?.rating)}
              </div>
              <p className="text-sm text-muted-foreground">
                Basado en {totalReviews} reseñas
              </p>
            </div>

            {/* Rating Distribution */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1]?.map(rating => {
                const count = ratingDistribution?.[rating];
                const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                
                return (
                  <div key={rating} className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground w-8">
                      {rating}
                    </span>
                    <Icon name="Star" size={12} color="var(--color-warning)" className="fill-current" />
                    <div className="flex-1 bg-muted rounded-full h-2">
                      <div
                        className="bg-warning h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Review Categories */}
            <div className="mt-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Puntualidad</span>
                <div className="flex items-center space-x-1">
                  {renderStars(4.5)}
                  <span className="text-sm text-muted-foreground ml-1">4.5</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Comunicación</span>
                <div className="flex items-center space-x-1">
                  {renderStars(4.7)}
                  <span className="text-sm text-muted-foreground ml-1">4.7</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Profesionalismo</span>
                <div className="flex items-center space-x-1">
                  {renderStars(4.8)}
                  <span className="text-sm text-muted-foreground ml-1">4.8</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Instalaciones</span>
                <div className="flex items-center space-x-1">
                  {renderStars(4.3)}
                  <span className="text-sm text-muted-foreground ml-1">4.3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:w-2/3 flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {currentReviews?.map((review, index) => (
                  <div key={index} className="border-b border-border pb-6 last:border-b-0">
                    <div className="flex items-start space-x-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary">
                          {review?.patientName?.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <h4 className="font-medium text-foreground">
                              {review?.patientName}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center space-x-1">
                                {renderStars(review?.rating)}
                              </div>
                              <span className="text-sm text-muted-foreground">
                                {review?.date}
                              </span>
                            </div>
                          </div>
                          {review?.verified && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-success bg-success/10">
                              <Icon name="CheckCircle" size={10} className="mr-1" />
                              Verificado
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground mb-3">
                          {review?.comment}
                        </p>

                        {review?.visitType && (
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span className="flex items-center space-x-1">
                              <Icon name="Calendar" size={10} />
                              <span>{review?.visitType}</span>
                            </span>
                            {review?.waitTime && (
                              <span className="flex items-center space-x-1">
                                <Icon name="Clock" size={10} />
                                <span>Tiempo de espera: {review?.waitTime}</span>
                              </span>
                            )}
                          </div>
                        )}

                        {/* Helpful votes */}
                        <div className="flex items-center space-x-4 mt-3">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            iconName="ThumbsUp"
                            iconPosition="left"
                          >
                            Útil ({review?.helpfulVotes || 0})
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs"
                            iconName="Flag"
                            iconPosition="left"
                          >
                            Reportar
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-6 border-t border-border">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Mostrando {startIndex + 1}-{Math.min(startIndex + reviewsPerPage, totalReviews)} de {totalReviews} reseñas
                  </p>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                      iconPosition="left"
                    >
                      Anterior
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Siguiente
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;