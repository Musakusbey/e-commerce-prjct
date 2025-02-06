const React = require('react');
const { render, screen } = require('@testing-library/react');
const Home = require('../pages/index').default;

describe('Home Page', () => {
  it('renders homepage', () => {
    render(<Home />);
    
    // queryAllBy kullanarak birden fazla eşleşmeyi ele alalım
    const welcomeTexts = screen.queryAllByText(/Hoş Geldiniz/i);
    expect(welcomeTexts.length).toBeGreaterThan(0);

    const viewProductsButton = screen.getByText(/Ürünleri Görüntüle/i);
    expect(viewProductsButton).toBeInTheDocument();
  });
});  