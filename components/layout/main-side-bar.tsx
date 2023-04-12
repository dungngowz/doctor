import { logoutApi } from '@/plugins/auth/api'
import { openSidebarState, roleState } from '@/store/common'
import { isUserLoadingState, permissionsRuleState } from '@/store/user'
import { t } from '@/utils'
import {
  AccountBalance,
  AccountTree,
  Apartment,
  Assessment,
  Construction,
  ContentPasteGo,
  CreateNewFolder,
  CurrencyExchange,
  Curtains,
  DirectionsCar,
  DynamicForm,
  EmojiTransportation,
  EventRepeat,
  IntegrationInstructions,
  Inventory2,
  LocalShipping,
  Logout,
  MedicalInformation,
  MonetizationOn,
  PieChart,
  Public,
  PublishedWithChanges,
  RecentActors,
  RequestQuote,
  RoomPreferences,
  SettingsBackupRestore,
  Summarize,
  SupervisedUserCircle,
  Widgets,
} from '@mui/icons-material'
import { Box, Button, Drawer, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { MenuItemSkeleton } from '../skeleton/menu-item-skeleton'
import { SideBarItem } from './side-bar-item'
import { MenuSubType, MenuType } from './type'

/* A React component that is used to render the sidebar of the application. */
export const MainSideBar = () => {
  // State
  const [activeId, setActiveId] = useState('')
  const [isFirstMenuLoading, setIsFirstMenuLoading] = useState(true)
  const [innerHeight, setInnerHeight] = useState(0)

  // Recoil
  const isSidebarOpen = useRecoilValue(openSidebarState)
  const [submenuIndexActived, setSubmenuIndexActived] = useState('')
  const role = useRecoilValue(roleState)

  // Hooks
  const router = useRouter()

  // Handle router path
  const handleRouter = (type = 'main', id: string, path: string) => {
    if (type == 'main') {
      setActiveId(id)
      router.push(path)
      setSubmenuIndexActived('')
    } else if (type == 'sub') {
      router.push(path)
      setSubmenuIndexActived('')
    } else if (type == 'sub2') {
      router.push(path)
    }
    handleCloseSidebar()
  }

  // Handle show the sub item
  const handleExpandSub = (id: string) => {
    setActiveId(id == activeId ? '' : id)
  }

  // Handle action click to sub menu
  const handleClickSubmenu = (id: string) => {
    setSubmenuIndexActived(submenuIndexActived == id ? '' : id)
  }

  // On close side bar
  const handleCloseSidebar = () => {
    setRecoil(openSidebarState, false)
  }

  // Handle log out
  const handleLogout = () => {
    logoutApi(router)
  }

  /* Watching the path and setting the activeId to the parentId of the submenu item. */
  useEffect(() => {
    const path = router.asPath

    mainNavItems.forEach((item: MenuType) => {
      if (item?.submenu) {
        const navItem =
          item?.submenu?.length > 0 && item.submenu.find((i: MenuSubType) => i.to === path)

        item?.submenu.forEach((o) => {
          const subItem = o?.submenu && o.submenu?.find((q: MenuSubType) => q.to == path)

          if (subItem) {
            setSubmenuIndexActived(subItem?.subParentId)
            setActiveId(subItem?.parentId)
          }
        })

        if (navItem) {
          setActiveId(navItem.parentId)
        }
      }
    })

    if (role) {
      setTimeout(() => {
        setIsFirstMenuLoading(false)
      }, 1000)
    }
  }, [router, role])

  useEffect(() => {
    window.addEventListener('resize', (e) => {
      setInnerHeight(window.innerHeight)
    })

    setInnerHeight(window?.innerHeight)
  }, [])

  const isUserLoading = useRecoilValue(isUserLoadingState)
  const permissionsRule = useRecoilValue(permissionsRuleState)

  const mainNavItems: MenuType[] = [
    {
      id: 'dashboard',
      label: t('dashboard'),
      to: '/',
      icon: <PieChart />,
      submenu: [],
      permission: true,
    },
    {
      id: 'customer',
      label: t('customerNavLabel'),
      to: '/customer',
      icon: <SupervisedUserCircle />,
      permission:
        (!isUserLoading && permissionsRule.includes('investors_view')) ||
        permissionsRule.includes('contractors_view')
          ? true
          : false,
      submenu: [
        {
          permission: !isUserLoading && permissionsRule.includes('investors_view') ? true : false,
          id: 'investor',
          icon: <Apartment />,
          label: t('investorNavLabel'),
          parentId: 'customer',
          to: '/customer/investor',
          submenu: [],
        },
        {
          id: 'constructionContractor',
          icon: <RoomPreferences />,
          label: t('constructionContractorNavLabel'),
          parentId: 'customer',
          to: '/customer/contractor',
          submenu: [],
          permission: !isUserLoading && permissionsRule.includes('contractors_view') ? true : false,
        },
      ],
    },
    {
      id: 'project',
      label: t('projectNavLabel'),
      to: '/project',
      icon: <Construction />,
      submenu: [],
      permission: !isUserLoading && permissionsRule.includes('projects_view') ? true : false,
    },

    {
      id: 'sales',
      label: t('salesNavLabel'),
      to: '/sales',
      icon: <MonetizationOn />,
      permission:
        (!isUserLoading && permissionsRule.includes('quotes_view')) ||
        permissionsRule.includes('contracts_view') ||
        permissionsRule.includes('orders_view')
          ? true
          : false,
      submenu: [
        {
          id: 'quote',
          label: t('quoteNavLabel'),
          to: '/sales/quote',
          icon: <RequestQuote />,
          parentId: 'sales',
          submenu: [],
          permission: !isUserLoading && permissionsRule.includes('quotes_view') ? true : false,
        },
        {
          id: 'contract',
          label: t('contractNavLabel'),
          to: '/sales/contract',
          icon: <Summarize />,
          parentId: 'sales',
          submenu: [],
          permission: !isUserLoading && permissionsRule.includes('contracts_view') ? true : false,
        },
        {
          id: 'order',
          label: t('orderNavLabel'),
          to: '/sales/order',
          icon: <Inventory2 />,
          parentId: 'sales',
          submenu: [],
          permission: !isUserLoading && permissionsRule.includes('orders_view') ? true : false,
        },
        {
          id: 'debt',
          label: t('debtNavLabel'),
          to: '/sales/debt',
          icon: <CurrencyExchange />,
          parentId: 'sales',
          submenu: [],
          permission: !isUserLoading && permissionsRule.includes('orders_view') ? true : false,
        },
      ],
    },
    {
      id: 'schedules',
      label: t('schedulesNavLabel'),
      icon: <EventRepeat />,
      to: '/schedules',
      submenu: [],
      actived: ['/schedules/product-deliveries/[scheduleId]'],
      permission: !isUserLoading && permissionsRule.includes('schedules_view') ? true : false,
    },

    {
      id: 'product-delivering',
      label: t('productDeliveriesNavLabel'),
      icon: <ContentPasteGo />,
      to: '/product-delivering',
      submenu: [],
      permission:
        !isUserLoading && permissionsRule.includes('product_deliveries_view') ? true : false,
    },

    {
      id: 'product-input',
      label: t('productInputNavLabel'),
      icon: <IntegrationInstructions />,
      to: '/product-input',
      submenu: [],
      permission: !isUserLoading && permissionsRule.includes('product_input_view') ? true : false,
    },

    {
      id: 'report',
      label: t('reportNavLabel'),
      icon: <Assessment />,
      to: '/report',
      permission:
        !isUserLoading && permissionsRule.includes('report_product_input_view') ? true : false,
      submenu: [
        {
          id: 'report-export',
          icon: <PublishedWithChanges />,
          label: t('reportExportNavLabel'),
          parentId: 'report',
          submenu: [],
          to: '/report-export',
          permission:
            !isUserLoading && permissionsRule.includes('report_product_input_view') ? true : false,
        },
        {
          id: 'report-input',
          icon: <SettingsBackupRestore />,
          label: t('reportInputNavLabel'),
          parentId: 'report',
          submenu: [],
          to: '/report-input',
          permission:
            !isUserLoading && permissionsRule.includes('report_product_input_view') ? true : false,
        },
      ],
    },
    {
      id: 'product',
      label: t('productNavLabel'),
      to: '/product',
      icon: <Curtains />,
      submenu: [],
      permission: !isUserLoading && permissionsRule.includes('products_view') ? true : false,
    },
    {
      id: 'staff',
      label: t('staffNavLabel'),
      to: '/staff',
      icon: <RecentActors />,
      submenu: [],
      permission: !isUserLoading && permissionsRule.includes('staffs_view') ? true : false,
    },
    {
      id: 'departments',
      label: t('departmentsNavLabel'),
      to: '/departments',
      icon: <RecentActors />,
      submenu: [],
      permission: !isUserLoading && permissionsRule.includes('departments_view') ? true : false,
    },
    {
      id: 'settings',
      label: t('settings'),
      to: '/settings',
      icon: <Widgets />,
      permission:
        (!isUserLoading && permissionsRule.includes('sales_forms_view')) ||
        permissionsRule.includes('customer_types_view') ||
        permissionsRule.includes('investor_types_view') ||
        permissionsRule.includes('shipping_unit_view') ||
        permissionsRule.includes('suppliers_view') ||
        permissionsRule.includes('stations_view') ||
        permissionsRule.includes('vehicles_view') ||
        permissionsRule.includes('regions_view') ||
        permissionsRule.includes('provinces_view') ||
        permissionsRule.includes('districts_view')
          ? true
          : false,

      submenu: [
        {
          id: 'sales-forms',
          label: t('salesFormsNavLabel'),
          to: '/sales-forms',
          icon: <DynamicForm />,
          submenu: [],
          parentId: 'settings',
          permission: !isUserLoading && permissionsRule.includes('sales_forms_view') ? true : false,
        },

        {
          id: 'customer-types',
          label: t('customerTypeNavLabel'),
          to: '/customer-types',
          icon: <AccountTree />,
          submenu: [],
          parentId: 'settings',
          permission:
            !isUserLoading && permissionsRule.includes('customer_types_view') ? true : false,
        },
        {
          id: 'investor-type',
          label: t('investorTypeNavLabel'),
          to: '/investor-type',
          icon: <AccountBalance />,
          submenu: [],
          parentId: 'settings',
          permission:
            !isUserLoading && permissionsRule.includes('investor_types_view') ? true : false,
        },
        {
          id: 'shipping-unit',
          label: t('shippingUnitNavLabel'),
          to: '/shipping-unit',
          icon: <LocalShipping />,
          submenu: [],
          parentId: 'settings',
          permission:
            !isUserLoading && permissionsRule.includes('shipping_unit_view') ? true : false,
        },
        {
          id: 'supplier',
          label: t('supplierNavLabel'),
          to: '/supplier',
          submenu: [],
          icon: <MedicalInformation />,
          parentId: 'settings',
          permission: !isUserLoading && permissionsRule.includes('suppliers_view') ? true : false,
        },
        {
          id: 'stations',
          label: t('stationNavLabel'),
          icon: <EmojiTransportation />,
          to: '/station',
          submenu: [],
          parentId: 'settings',
          permission: !isUserLoading && permissionsRule.includes('stations_view') ? true : false,
        },
        {
          id: 'vehicle',
          label: t('vehicleNavLabel'),
          to: '/vehicle',
          submenu: [],
          icon: <DirectionsCar />,
          parentId: 'settings',
          permission: !isUserLoading && permissionsRule.includes('vehicles_view') ? true : false,
        },
        {
          id: 'area',
          label: t('areaNavLabel'),
          to: '/area',
          icon: <Public />,
          parentId: 'settings',
          permission: !isUserLoading
            ? permissionsRule.includes('regions_view') ||
              permissionsRule.includes('provinces_view') ||
              permissionsRule.includes('districts_view')
              ? true
              : false
            : false,
          submenu: [
            {
              id: 'region',
              label: t('regionNavLabel'),
              to: '/area/region',
              icon: <CreateNewFolder />,
              parentId: 'settings',
              subParentId: 'area',
              permission: !isUserLoading && permissionsRule.includes('regions_view') ? true : false,
            },
            {
              id: 'province',
              label: t('provinceNavLabel'),
              to: '/area/province',
              icon: <CreateNewFolder />,
              parentId: 'settings',
              subParentId: 'area',
              permission:
                !isUserLoading && permissionsRule.includes('provinces_view') ? true : false,
            },
            {
              id: 'district',
              label: t('districtNavLabel'),
              to: '/area/district',
              icon: <CreateNewFolder />,
              parentId: 'settings',
              subParentId: 'area',
              permission:
                !isUserLoading && permissionsRule.includes('districts_view') ? true : false,
            },
          ],
        },
      ],
    },
  ]

  const SideBarChild = (
    <Box id="pr-app-sidebar" className="side-bar-wrapper">
      {/* begin::Logo */}
      <Box className="side-bar-wrapper--logo">ERP Admin</Box>
      <Box
        className="app-sidebar-menu"
        height={{ xs: innerHeight - 100 + 'px', xl: 'calc(100vh - 100px)' }}
      >
        {isFirstMenuLoading ? (
          <MenuItemSkeleton />
        ) : (
          <Stack spacing={0.5}>
            {mainNavItems.map((menu: MenuType, index: number) => (
              <SideBarItem
                key={index}
                menu={menu}
                activeId={activeId}
                handleClickSubmenu={handleClickSubmenu}
                handleExpandSub={handleExpandSub}
                handleRouter={handleRouter}
                submenuIndexActived={submenuIndexActived}
              />
            ))}

            <Button className="btn-base" startIcon={<Logout />} onClick={handleLogout}>
              {t('logoutLabel')}
            </Button>
          </Stack>
        )}
      </Box>
    </Box>
  )

  return (
    <>
      {/* Web show  */}
      <Box display={{ xs: 'none', lg: 'flex' }}>{SideBarChild}</Box>

      {/* mobile show  */}
      <Drawer anchor={'left'} open={isSidebarOpen} onClose={handleCloseSidebar}>
        <Box border={1} borderColor={'#fff'}>
          {SideBarChild}
        </Box>
      </Drawer>
    </>
  )
}
