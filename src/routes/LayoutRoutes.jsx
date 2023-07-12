import React, { Fragment } from 'react'
import { Route, Routes } from 'react-router-dom'
import App from '../components/app'

import Dashboard from '../components/dashboard/dashboard'
import Reports from '../components/reports/report'
import Profile from '../components/settings/profile'


/* Inventory */
import AddInventory from '../components/inventory/add-inventory'
import InventoryList from '../components/inventory/inventory-list'
import ProvidersList from '../components/inventory/providers-list'
import ProductInventory from '../components/inventory/prod-inventory'
import ProductStocking from '../components/inventory/prod-stocking'

/* Services */
import AddService from '../components/services/add-service'
import ServiceList from '../components/services/services-list'

/* Clients */
import Create_client from '../components/clients/create-client'
import List_clients from '../components/clients/list-client'

/* Sales */
import Create_sale from '../components/sales/create-sale'
import List_sales from '../components/sales/list-sales'

/* Caja */
import AddSpend from '../components/money/add-spend'
import MoneyList from '../components/money/money-list'

/* Users */
import Create_user from '../components/users/create-user'
import List_users from '../components/users/list-users'

const LayoutRoutes = () => {
  return (
    <Fragment>
        <Routes>
            <Route element={<App />}>
            <Route
							path={`${process.env.PUBLIC_URL}/dashboard`}
							element={<Dashboard />}
						/>
						{/* Inventory */}
						<Route
							path={`${process.env.PUBLIC_URL}/inventory/add-inventory/:id?`}
							element={<AddInventory />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/inventory/inventory-list`}
							element={<InventoryList />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/inventory/providers-list`}
							element={<ProvidersList />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/inventory/prod-inventory/:id?`}
							element={<ProductInventory />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/inventory/prod-stocking/:id?`}
							element={<ProductStocking />}
						/>

						{/* Services */}
						<Route
							path={`${process.env.PUBLIC_URL}/services/add-service/:id?`}
							element={<AddService />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/services/service-list`}
							element={<ServiceList />}
						/>

						{/* Clients */}					
						<Route
							path={`${process.env.PUBLIC_URL}/clients/list-clients`}
							element={<List_clients />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/clients/create-client/:id?`}
							element={<Create_client />}
						/>					

						{/* Sales */}	
						<Route
							path={`${process.env.PUBLIC_URL}/sales/list-sales`}
							element={<List_sales />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/sales/create-sale`}
							element={<Create_sale />}
						/>

						{/* Caja */}
						<Route
							path={`${process.env.PUBLIC_URL}/money/add-spend`}
							element={<AddSpend />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/money/money-list`}
							element={<MoneyList />}
						/>

						{/* Users */}						
						<Route
							path={`${process.env.PUBLIC_URL}/users/list-users`}
							element={<List_users />}
						/>
						<Route
							path={`${process.env.PUBLIC_URL}/users/create-user/:id?`}
							element={<Create_user />}
						/>			
																							
						<Route
							path={`${process.env.PUBLIC_URL}/reports/report`}
							element={<Reports />}
						/>
						<Route 
							path={`${process.env.PUBLIC_URL}/settings/profile`}
							element={<Profile />}
						/>
												
                </Route>
        </Routes>
    </Fragment>
    )
}

export default LayoutRoutes