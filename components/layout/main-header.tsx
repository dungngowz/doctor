import { userProfileApi } from '@/meta/user'
import { logoutApi } from '@/plugins/auth/api'
import { breadcrumbsState, openSidebarState } from '@/store/common'
import { userState } from '@/store/user'
import { BreadcrumbType } from '@/types'
import { initChannel, t } from '@/utils'
import { Edit, Logout } from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import {
  AppBar,
  Box,
  Breadcrumbs,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useRecoilValue } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { Avatar } from '../avatar'
import { ModalUpdateProfile } from './modal-update-profile'
export const MainHeader = () => {
  // Hooks
  const [anchorAccountMenuEl, setAnchorAccountMenuEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorAccountMenuEl)
  const router = useRouter()
  const breadcrumbs = useRecoilValue(breadcrumbsState)
  const user = useRecoilValue(userState)

  // State
  const [openModalUpdateProfile, setOpenModalUpdateProfile] = useState(false)

  // Handle click show account menu
  const handleClickAccountMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorAccountMenuEl(event.currentTarget)
  }

  // Handle close menu
  const handleClose = () => {
    setAnchorAccountMenuEl(null)
  }

  // Last breadcrumb
  const isLastBreadcrumb = (id: number) => {
    return id === breadcrumbs.length - 1
  }

  /**
   * It calls the logoutApi function, which is imported from the api.ts file, and passes the router
   * object as an argument
   */
  const handleLogout = () => {
    logoutApi(router)
  }

  // Mobile sidebar
  const handleOpeSideBar = () => {
    setRecoil(openSidebarState, true)
  }

  // Watch me api
  useEffect(() => {
    userProfileApi()

    const channel = initChannel()
    channel.bind(`permission.update`, function () {
      userProfileApi()
    })
  }, [])

  return (
    <>
      <AppBar id="pr-main-header" position="fixed" elevation={0} className="main-header-wrapper">
        <Toolbar>
          <Box className="main-header-wrapper--btn-menu">
            <IconButton size="small" edge="start" onClick={handleOpeSideBar}>
              <MenuIcon />
            </IconButton>
          </Box>

          {/* Left side  */}
          <Breadcrumbs aria-label="breadcrumb" className="breadcrumb">
            {breadcrumbs.map((item: BreadcrumbType, i: number) => (
              <Button
                key={i}
                disabled={isLastBreadcrumb(i)}
                size="small"
                onClick={() => router.push(item.to)}
              >
                {item.name}
              </Button>
            ))}
          </Breadcrumbs>
          {/* end::Left side  */}

          {/* start::Right side  */}
          <Box
            aria-controls={open ? 'account-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClickAccountMenu}
          >
            <Avatar />
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile menu  */}
      <Menu
        anchorEl={anchorAccountMenuEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        PaperProps={{
          className: 'account-menu',
        }}
      >
        <Box minWidth={{ xs: '180px', md: '300px' }}>
          <Stack spacing={1} className="profile-wrapper">
            <Stack direction={'row'} alignItems="center">
              <Avatar height={60} width={60} />
              <Stack pl={1}>
                <Typography className="menu-label">{user?.name}</Typography>
                <Typography className="menu-email">{user?.email}</Typography>
                <Typography className="menu-email">
                  Phòng ban: <span>{user?.department?.title}</span>
                </Typography>
              </Stack>
            </Stack>
            <Button
              variant="filledTonal"
              startIcon={<Edit />}
              size="small"
              onClick={() => {
                setAnchorAccountMenuEl(null)
                setOpenModalUpdateProfile(true)
              }}
            >
              {t('userUpdateProfileBtn')}
            </Button>
          </Stack>
          <MenuItem onClick={handleLogout}>
            <Logout />
            <Typography pl={2} fontSize="13px">
              Đăng xuất
            </Typography>
          </MenuItem>
        </Box>
      </Menu>

      {openModalUpdateProfile && (
        <ModalUpdateProfile
          open={openModalUpdateProfile}
          handleClose={() => setOpenModalUpdateProfile(false)}
        />
      )}
    </>
  )
}
