import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, logout } from '../services/auth'
import './css/styles.css'

export default function AdminDashboard() {
  const navigate = useNavigate()
  const currentUser = getCurrentUser()

  useEffect(() => {
    // Load Chart.js and initialize charts
    const loadCharts = async () => {
      if (typeof Chart === 'undefined') {
        const script = document.createElement('script')
        script.src = 'https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js'
        script.async = true
        script.onload = () => {
          initCharts()
        }
        document.body.appendChild(script)
      } else {
        initCharts()
      }
    }

    const initCharts = () => {
      // Area Chart
      const areaCtx = document.getElementById('areaChart')
      if (areaCtx && window.Chart) {
        new window.Chart(areaCtx, {
          type: 'line',
          data: {
            labels: ['Mar 1', 'Mar 3', 'Mar 5', 'Mar 7', 'Mar 9', 'Mar 11', 'Mar 13'],
            datasets: [{
              label: 'Revenue',
              data: [10000, 30000, 19000, 25000, 22000, 30000, 32000, 40000],
              fill: true,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 2,
              tension: 0.4,
              pointRadius: 4,
              pointBackgroundColor: 'rgb(59, 130, 246)'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: true }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
      }

      // Bar Chart
      const barCtx = document.getElementById('barChart')
      if (barCtx && window.Chart) {
        new window.Chart(barCtx, {
          type: 'bar',
          data: {
            labels: ['January', 'February', 'March', 'April', 'May', 'June'],
            datasets: [{
              label: 'Sales',
              data: [4000, 5000, 6000, 7000, 8000, 15000],
              backgroundColor: 'rgb(59, 130, 246)',
              borderColor: 'rgb(59, 130, 246)',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: { display: true }
            },
            scales: {
              y: { beginAtZero: true }
            }
          }
        })
      }
    }

    loadCharts()
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  return (
    <div className="sb-nav-fixed">
      {/* Top Navigation */}
      <nav className="sb-topnav navbar navbar-expand navbar-light bg-white border-bottom">
        <a className="navbar-brand ps-3 vere-brand" href="/admin">Vere</a>
        <button className="btn btn-link btn-sm order-1 order-lg-0 me-4 me-lg-0" id="sidebarToggle" href="#"><i className="fas fa-bars"></i></button>
        <form className="d-none d-md-inline-block form-inline ms-auto me-0 me-md-3 my-2 my-md-0">
          <div className="input-group">
            <input className="form-control" type="text" placeholder="Search for..." aria-label="Search for..." aria-describedby="btnNavbarSearch" />
            <button className="btn btn-primary" id="btnNavbarSearch" type="button"><i className="fas fa-search"></i></button>
          </div>
        </form>
        {/* Create Admin and Home buttons visible in admin topnav */}
        <a className="btn btn-outline-secondary btn-sm me-2" href="/admin/setup">Create Admin</a>
        <a className="btn btn-outline-primary btn-sm me-2" href="/">Home</a>
        <ul className="navbar-nav ms-auto ms-md-0 me-3 me-lg-4">
          <li className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" id="navbarDropdown" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false"><i className="fas fa-user fa-fw"></i></a>
            <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
              <li><a className="dropdown-item" href="#">Settings</a></li>
              <li><a className="dropdown-item" href="#">Activity Log</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="#" onClick={handleLogout}>Logout</a></li>
            </ul>
          </li>
        </ul>
      </nav>

      <div id="layoutSidenav">
        {/* Sidebar */}
        <div id="layoutSidenav_nav">
          <nav className="sb-sidenav accordion sb-sidenav-light" id="sidenavAccordion">
            <div className="sb-sidenav-menu">
              <div className="nav">
                <div className="sb-sidenav-menu-heading">Core</div>
                <a className="nav-link" href="/admin">
                  <div className="sb-nav-link-icon"><i className="fas fa-tachometer-alt"></i></div>
                  Dashboard
                </a>
                <div className="sb-sidenav-menu-heading">Addons</div>
                <a className="nav-link" href="/admin/tables">
                  <div className="sb-nav-link-icon"><i className="fas fa-table"></i></div>
                  Tables
                </a>
              </div>
            </div>
            <div className="sb-sidenav-footer">
              <div className="small">Logged in as:</div>
              {currentUser?.username || 'Admin'}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div id="layoutSidenav_content">
          <main>
            <div className="container-fluid px-4">
              <h1 className="mt-4">Dashboard</h1>
              <ol className="breadcrumb mb-4">
                <li className="breadcrumb-item active">Dashboard</li>
              </ol>

              {/* Stats Cards */}
              <div className="row mb-4">
                <div className="col-md-6 col-lg-3 mb-3">
                  <div className="card bg-primary text-white">
                    <div className="card-body">
                      <div className="card-title">Primary Card</div>
                      <div className="card-text mb-2">Support card subtitle</div>
                      <a className="text-white" href="#!">View Details →</a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <div className="card-title">Warning Card</div>
                      <div className="card-text mb-2">Support card subtitle</div>
                      <a className="text-white" href="#!">View Details →</a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <div className="card-title">Success Card</div>
                      <div className="card-text mb-2">Support card subtitle</div>
                      <a className="text-white" href="#!">View Details →</a>
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-3 mb-3">
                  <div className="card bg-danger text-white">
                    <div className="card-body">
                      <div className="card-title">Danger Card</div>
                      <div className="card-text mb-2">Support card subtitle</div>
                      <a className="text-white" href="#!">View Details →</a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Row */}
              <div className="row mb-4">
                <div className="col-lg-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <i className="fas fa-chart-area me-1"></i>
                      Area Chart Example
                    </div>
                    <div className="card-body">
                      <canvas id="areaChart" style={{ maxHeight: '400px' }}></canvas>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6 mb-4">
                  <div className="card">
                    <div className="card-header">
                      <i className="fas fa-chart-bar me-1"></i>
                      Bar Chart Example
                    </div>
                    <div className="card-body">
                      <canvas id="barChart" style={{ maxHeight: '400px' }}></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
          <footer className="py-4 bg-light mt-auto">
            <div className="container-fluid px-4">
              <div className="d-flex align-items-center justify-content-between small">
                <div className="text-muted">Copyright © Your Website 2023</div>
                <div>
                  <a href="#">Privacy Policy</a>
                  &middot;
                  <a href="#">Terms &amp; Conditions</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
