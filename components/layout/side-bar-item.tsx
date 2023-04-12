import { ChevronRight, Circle, ExpandMore } from '@mui/icons-material'
import { Button, Collapse, Stack } from '@mui/material'
import { useRouter } from 'next/router'
import React from 'react'
import { MenuType } from './type'

type IProps = {
  menu: MenuType
  activeId: string
  submenuIndexActived: string
  handleExpandSub: (id: string) => void
  handleRouter: (type: string, id: string, path: string) => void
  handleClickSubmenu: (id: string) => void
}

export const SideBarItem = (props: IProps) => {
  const {
    menu,
    activeId = '',
    submenuIndexActived = '',
    handleRouter,
    handleExpandSub,
    handleClickSubmenu,
  } = props

  // Hooks
  const router = useRouter()

  const isActived = router.pathname === menu.to || menu?.actived?.includes(router.pathname)

  return (
    <React.Fragment>
      {menu?.permission ? (
        <React.Fragment>
          <Button
            className={`${isActived ? 'btn-nav-actived' : 'btn-base'}`}
            onClick={() => {
              if (menu?.submenu && menu?.submenu?.length > 0) {
                handleExpandSub(menu.id)
              } else {
                handleRouter('main', menu.id, menu.to)
              }
            }}
            startIcon={menu.icon}
            endIcon={
              menu?.submenu && menu.submenu?.length > 0 ? (
                activeId == menu?.id ? (
                  <ExpandMore />
                ) : (
                  <ChevronRight />
                )
              ) : null
            }
          >
            <span className="btn-label">{menu.label}</span>
          </Button>

          <Collapse in={menu?.submenu && menu?.submenu?.length > 0 && activeId == menu?.id}>
            <Stack pl={1.5} spacing={0.5}>
              {menu.submenu?.map((item: MenuType, i: number) => (
                <React.Fragment key={i}>
                  {item.permission ? (
                    <Button
                      startIcon={item.icon}
                      className={router.pathname === item.to ? 'btn-nav-actived' : 'btn-base'}
                      onClick={() => {
                        item && item.submenu?.length > 0
                          ? handleClickSubmenu(item.id)
                          : handleRouter('sub', item.id, item.to)
                      }}
                      endIcon={
                        item && item?.submenu?.length > 0 ? (
                          submenuIndexActived == item.id ? (
                            <ExpandMore />
                          ) : (
                            <ChevronRight />
                          )
                        ) : null
                      }
                    >
                      <span className="btn-label">{item.label}</span>
                    </Button>
                  ) : null}
                  {item.permission ? (
                    <Collapse
                      in={
                        item?.submenu &&
                        item?.submenu?.length > 0 &&
                        submenuIndexActived == item?.id
                      }
                    >
                      <Stack pl={2} spacing={0.5}>
                        {item?.submenu?.length > 0 &&
                          item?.submenu.map((submenu: MenuType, i: number) => (
                            <React.Fragment key={i}>
                              {submenu?.permission ? (
                                <Button
                                  onClick={() => handleRouter('sub2', submenu?.id, submenu?.to)}
                                  className={
                                    router.asPath === submenu.to ? 'btn-nav-actived' : 'btn-base'
                                  }
                                  startIcon={<Circle sx={{ width: '8px' }} />}
                                >
                                  {submenu.label}
                                </Button>
                              ) : null}
                            </React.Fragment>
                          ))}
                      </Stack>
                    </Collapse>
                  ) : null}
                </React.Fragment>
              ))}
            </Stack>
          </Collapse>
        </React.Fragment>
      ) : null}
    </React.Fragment>
  )
}
