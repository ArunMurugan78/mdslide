import { FC } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  Avatar,
  IconButton,
  MenuList,
  MenuButtonProps,
} from "@chakra-ui/react";
import { useUser } from "@auth0/nextjs-auth0";

export type AccountOptionsProps = {
  size: "sm" | "md";
  isDisabled?: boolean;
} & MenuButtonProps;

export const AccountOptions: FC<AccountOptionsProps> = (props) => {
  const { size, isDisabled, ...rest } = props;
  const { user } = useUser();

  const avatarSize = size === "sm" ? "28px" : "37px";

  return (
    <Menu>
      <MenuButton
        as={IconButton}
        _focus={{ outline: "black solid 2px" }}
        isRound
        disabled={isDisabled}
        bg="transparent"
        size={size}
        icon={
          <Avatar
            height={avatarSize}
            width={avatarSize}
            name={user?.name ?? ""}
            src={user?.picture ?? ""}
          />
        }
        {...rest}
      >
        Actions
      </MenuButton>
      <MenuList>
        <MenuItem as={"a"} href="/api/auth/logout">
          Logout
        </MenuItem>
      </MenuList>
    </Menu>
  );
};