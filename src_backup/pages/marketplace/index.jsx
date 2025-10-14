import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * Alias legacy de /marketplace.
 * Siempre redirige al Hub mixto para elegir B2C o B2B.
 */
export default function MarketplaceAlias() {
  return <Navigate to="/marketplace-hub" replace />;
}
