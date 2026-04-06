import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, onRate, editable = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseEnter={() => editable && setHover(star)}
          onMouseLeave={() => editable && setHover(0)}
          onClick={() => editable && onRate(star)}
          style={{ cursor: editable ? 'pointer' : 'default', transition: 'all 0.2s' }}
        >
          <Star
            size={20}
            fill={(hover || rating) >= star ? '#f59e0b' : 'transparent'}
            color={(hover || rating) >= star ? '#f59e0b' : 'var(--border)'}
          />
        </span>
      ))}
    </div>
  );
};

export default RatingStars;
