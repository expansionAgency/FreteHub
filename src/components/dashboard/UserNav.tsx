"use client"

import { Avatar } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export function UserNav() {
  const router = useRouter()

  // Esta função seria substituída por um sistema real de logout
  const handleLogout = () => {
    // Limpar estado de autenticação, tokens, etc.
    router.push('/entrar')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 hover:bg-accent hover:text-accent-foreground rounded-full p-1">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="José Silva" />
            <AvatarFallback>JS</AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium">José Silva</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">José Silva</p>
            <p className="text-xs leading-none text-muted-foreground">
              jose.silva@exemplo.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/dashboard/perfil')}>
            Perfil
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/dashboard/configuracoes')}>
            Configurações
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600">
          Sair
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function AvatarImage(props: React.ComponentProps<"img">) {
  return (
    <img
      className="h-full w-full rounded-full object-cover"
      {...props}
    />
  )
}

function AvatarFallback(props: React.ComponentProps<"div">) {
  return (
    <div
      className="flex h-full w-full items-center justify-center rounded-full bg-muted"
      {...props}
    />
  )
} 