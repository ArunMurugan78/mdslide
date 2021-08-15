import axios from "axios";
import { debounce } from "debounce";
import Link from "next/link";
import { useRouter } from "next/router";
import { FC, useState } from "react";
import {
  Input,
  Flex,
  Spacer,
  Avatar,
  Button,
  Spinner,
  Box,
  Icon,
} from "@chakra-ui/react";
import { AccountOptions } from "../AccountOptions";
import { Logo } from "../Logo";
import { useStore } from "../../lib/stores/EditorPage";

export interface NavbarProps {
  title: string;
  pid: string;
}

export const Navbar: FC<NavbarProps> = (props) => {
  const { title: initialTitle, pid } = props;
  const isSaving = useStore((state) => state.isSaving);
  const router = useRouter();

  const [title, setTitle] = useState(initialTitle);

  const updateRemote = debounce(async (newTitle: string) => {
    // TODO handle error.
    await axios.patch(`/api/p/${pid}/title`, { title: newTitle });
  }, 500);

  const updateTitle = async (newTitle: string) => {
    setTitle(newTitle);

    await updateRemote(newTitle.trim() || "Untitled");
  };

  return (
    <Flex
      color="#495464"
      as="nav"
      p="20px"
      boxShadow="xl"
      width="100%"
      height="70px"
      alignItems="center"
    >
      <Link href="/">
        <Logo fontSize="xl" />
      </Link>
      <Spacer />
      <Input
        maxWidth="400px"
        textAlign="center"
        value={title}
        required
        isInvalid={title?.trim() === ""}
        focusBorderColor="black"
        onChange={(e) => updateTitle(e.target.value)}
      />
      <Spacer />
      {isSaving ? (
        <Spinner emptyColor="gray.200" width="25px" height="25px" />
      ) : (
        <Icon viewBox="0 0 24 24" width="34px" color="gray.300" height="34px">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill="currentColor"
          />
        </Icon>
      )}
      <AccountOptions size="sm" />
    </Flex>
  );
};
