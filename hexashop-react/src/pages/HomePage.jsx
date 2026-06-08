import { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import MainBanner from '../components/home/MainBanner';
import ProductCarousel from '../components/home/ProductCarousel';
import ExploreSection from '../components/home/ExploreSection';
import SocialMedia from '../components/home/SocialMedia';
import Subscribe from '../components/layout/Subscribe';

const HomePage = () => {
  const [menProducts, setMenProducts] = useState([]);
  const [womenProducts, setWomenProducts] = useState([]);
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    const fetchHomeProducts = async () => {
      try {
        const [menRes, womenRes, kidsRes] = await Promise.all([
          axiosClient.get('/products', { params: { category: 'men', limit: 6 } }),
          axiosClient.get('/products', { params: { category: 'women', limit: 6 } }),
          axiosClient.get('/products', { params: { category: 'kids', limit: 6 } })
        ]);

        setMenProducts(menRes.data.products);
        setWomenProducts(womenRes.data.products);
        setKidsProducts(kidsRes.data.products);
      } catch (err) {
        console.error('Failed to fetch home products', err);
      }
    };

    fetchHomeProducts();
  }, []);

  return (
    <>
      <MainBanner />
      
      <ProductCarousel 
        title="Men's Latest" 
        subtitle="Details to details is what makes Hexashop different from the other themes."
        products={menProducts}
        category="men"
      />
      
      <ProductCarousel 
        title="Women's Latest" 
        subtitle="Details to details is what makes Hexashop different from the other themes."
        products={womenProducts}
        category="women"
      />
      
      <ProductCarousel 
        title="Kid's Latest" 
        subtitle="Details to details is what makes Hexashop different from the other themes."
        products={kidsProducts}
        category="kids"
      />
      
      <ExploreSection />
      
      <SocialMedia />
      
      <Subscribe />
    </>
  );
};

export default HomePage;
