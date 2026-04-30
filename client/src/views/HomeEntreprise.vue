<template>
  <div class="home-entreprise overflow-x-hidden">
    <HeaderPage />
    <Banner />
    <FeatureSection />
    <ServicesSection />
    <ContactForm />
    <FooterPage />
  </div>
</template>

<script lang="ts">
import Header from '../components/HomeEntreprise/Header.vue'
import Banner from '../components/HomeEntreprise/Banner.vue'
import FeatureSection from '../components/HomeEntreprise/FeatureSection.vue'
import ServicesSection from '../components/HomeEntreprise/ServicesSection.vue'
import ContactForm from '../components/HomeEntreprise/ContactForm.vue'
import Footer from '../components/HomeEntreprise/Footer.vue'

export default {
  name: 'HomeEntreprise',
  components: {
    HeaderPage: Header,
    Banner,
    FeatureSection,
    ServicesSection,
    ContactForm,
    FooterPage: Footer,
  },
}
</script>

<style scoped>
.home-entreprise {
  background-color: var(--color-premium-surface);
}
</style>
