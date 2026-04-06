import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating = 0, onRate, editable = false, disabled = false }) => {
  const [hover, setHover] = useState(0);

  return (
    <div style={{ display: 'flex', gap: '4px', opacity: disabled ? 0.5 : 1 }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onMouseEnter={() => editable && !disabled && setHover(star)}
          onMouseLeave={() => editable && !disabled && setHover(0)}
          onClick={() => editable && !disabled && onRate(star)}
          style={{ cursor: (editable && !disabled) ? 'pointer' : 'default', transition: 'all 0.2s' }}
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
