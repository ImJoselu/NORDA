import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RequireAdmin } from '@/components/auth/RequireAdmin'
import { RequireAuth } from '@/components/auth/RequireAuth'
import { Seo } from '@/components/seo/Seo'
import { Toaster } from '@/components/ui/Toaster'
import { AdminLayout } from '@/layouts/AdminLayout'
import { MainLayout } from '@/layouts/MainLayout'
import { useAuthBootstrap } from './useAuthBootstrap'

const Home = lazy(() => import('@/pages/Home').then((m) => ({ default: m.Home })))
const Coffee = lazy(() => import('@/pages/Coffee').then((m) => ({ default: m.Coffee })))
const CoffeeDetail = lazy(() => import('@/pages/CoffeeDetail').then((m) => ({ default: m.CoffeeDetail })))
const Origins = lazy(() => import('@/pages/Origins').then((m) => ({ default: m.Origins })))
const Finder = lazy(() => import('@/pages/Finder').then((m) => ({ default: m.Finder })))
const Journal = lazy(() => import('@/pages/Journal').then((m) => ({ default: m.Journal })))
const JournalPost = lazy(() => import('@/pages/JournalPost').then((m) => ({ default: m.JournalPost })))
const CountryPage = lazy(() => import('@/pages/CountryPage').then((m) => ({ default: m.CountryPage })))
const RegionPage = lazy(() => import('@/pages/RegionPage').then((m) => ({ default: m.RegionPage })))
const Login = lazy(() => import('@/pages/Login').then((m) => ({ default: m.Login })))
const Register = lazy(() => import('@/pages/Register').then((m) => ({ default: m.Register })))
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword').then((m) => ({ default: m.ForgotPassword })))
const ResetPassword = lazy(() => import('@/pages/ResetPassword').then((m) => ({ default: m.ResetPassword })))
const Account = lazy(() => import('@/pages/Account').then((m) => ({ default: m.Account })))
const AccountFavorites = lazy(() => import('@/pages/AccountFavorites').then((m) => ({ default: m.AccountFavorites })))
const AccountOrders = lazy(() => import('@/pages/AccountOrders').then((m) => ({ default: m.AccountOrders })))
const AccountOrderDetail = lazy(() => import('@/pages/AccountOrderDetail').then((m) => ({ default: m.AccountOrderDetail })))
const Checkout = lazy(() => import('@/pages/Checkout').then((m) => ({ default: m.Checkout })))
const AccountSubscriptions = lazy(() => import('@/pages/AccountSubscriptions').then((m) => ({ default: m.AccountSubscriptions })))

const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard').then((m) => ({ default: m.AdminDashboard })))
const AdminOrders = lazy(() => import('@/pages/admin/AdminOrders').then((m) => ({ default: m.AdminOrders })))
const AdminOrderDetail = lazy(() => import('@/pages/admin/AdminOrderDetail').then((m) => ({ default: m.AdminOrderDetail })))
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts').then((m) => ({ default: m.AdminProducts })))
const AdminProductForm = lazy(() => import('@/pages/admin/AdminProductForm').then((m) => ({ default: m.AdminProductForm })))
const AdminInventory = lazy(() => import('@/pages/admin/AdminInventory').then((m) => ({ default: m.AdminInventory })))
const AdminCustomers = lazy(() => import('@/pages/admin/AdminCustomers').then((m) => ({ default: m.AdminCustomers })))
const AdminReviews = lazy(() => import('@/pages/admin/AdminReviews').then((m) => ({ default: m.AdminReviews })))
const AdminCoupons = lazy(() => import('@/pages/admin/AdminCoupons').then((m) => ({ default: m.AdminCoupons })))
const AdminOrigins = lazy(() => import('@/pages/admin/AdminOrigins').then((m) => ({ default: m.AdminOrigins })))

export function App() {
  useAuthBootstrap()

  return (
    <>
      {/* Base Helmet: cualquier ruta sin su propio <Seo> (login, cuenta, admin...) hereda esto en vez de quedarse sin meta tags. Las rutas indexables la sobrescriben, ver ADR-007. */}
      <Seo
        title="NØRDA — Descubre el café detrás de cada origen"
        description="NØRDA es una plataforma de café de especialidad centrada en el descubrimiento de origen: mapa interactivo, recomendaciones personalizadas y catálogo curado."
        path="/"
      />
      <Suspense fallback={null}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/coffee" element={<Coffee />} />
            <Route path="/coffee/:slug" element={<CoffeeDetail />} />
            <Route path="/origins" element={<Origins />} />
            <Route path="/origins/:country" element={<CountryPage />} />
            <Route path="/origins/:country/:region" element={<RegionPage />} />
            <Route path="/finder" element={<Finder />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/journal/:slug" element={<JournalPost />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<RequireAuth />}>
              <Route path="/account" element={<Account />} />
              <Route path="/account/favorites" element={<AccountFavorites />} />
              <Route path="/account/orders" element={<AccountOrders />} />
              <Route path="/account/orders/:orderId" element={<AccountOrderDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/account/subscriptions" element={<AccountSubscriptions />} />
            </Route>
          </Route>

          <Route element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:orderId" element={<AdminOrderDetail />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/products/new" element={<AdminProductForm />} />
              <Route path="/admin/products/:productId" element={<AdminProductForm />} />
              <Route path="/admin/inventory" element={<AdminInventory />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/reviews" element={<AdminReviews />} />
              <Route path="/admin/coupons" element={<AdminCoupons />} />
              <Route path="/admin/origins" element={<AdminOrigins />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster />
    </>
  )
}
