import { render, screen } from '@testing-library/react';
import Home from '../pages/index';

describe('Ana Sayfa', () => {
  test('Ana sayfa doğru yüklenir', () => {
    render(<Home />);
    
    // getByText yerine daha kesin seçim yapalım
    const titleElement = screen.getByRole('heading', { name: /Hoş Geldiniz/i });
    const productsButton = screen.getByRole('link', { name: /Ürünleri Görüntüle/i });

    expect(titleElement).toBeInTheDocument();
    expect(productsButton).toBeInTheDocument();
  });
});
  