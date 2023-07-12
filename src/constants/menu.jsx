import {
    Home,
    DollarSign,
    Users,
    Box,
    BarChart,
    Settings,
    Briefcase,
    Zap
} from 'react-feather';

export const MENUITEMS = [
    {
        path: '/dashboard', title: 'Tablero', icon: Home, type: 'link', badgeType: 'primary', active: false
    },
    {
        title: 'Stock', icon: Box, type: 'sub', active: false, children: [
            { path: '/inventory/inventory-list', title: 'Productos', type: 'link' },
            { path: '/inventory/providers-list', title: 'Proveedores', type: 'link' },
            { path: '/inventory/prod-inventory', title: 'Inventario', type: 'link' },
            { path: '/inventory/prod-stocking', title: 'Compras', type: 'link' },            
        ]
    },
    {
        title: 'Servicios', path: '/services/service-list', icon: Zap, type: 'link', active: false
    },    
    {
        title: 'Clientes', path:'/clients/list-clients', icon: Users, type: 'link', active: false
    }, 
    {
        title: 'Ventas', icon: DollarSign, type: 'sub', active: false, children: [
            { path: '/sales/list-sales', title: 'Lista de Ventas', type: 'link' },
            { path: '/sales/create-sale', title: 'Nueva Venta', type: 'link' },
        ]
    },
    {
        title: 'Caja',path:'/money/money-list', icon: BarChart, type: 'link', active: false

    },
    {
        title: 'Usuarios', path: '/users/list-users', icon: Briefcase , type: 'link', active: false
    },        
    {
        title: 'Reportes',path:'/reports/report', icon: BarChart, type: 'link', active: false
    },
    {   
        path: '/settings/profile', title: 'Configuracion', icon: Settings, type: 'link', badgeType: 'primary', active: false    
    }    
]
