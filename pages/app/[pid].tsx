import Head from "next/head";
import debounce from "debounce";
import { useEffect } from "react";
import { ObjectId } from "mongodb";
import { GetServerSideProps } from "next";
import { withPageAuthRequired, getSession } from "@auth0/nextjs-auth0";
import { Grid, GridItem } from "@chakra-ui/react";

import PresentationModel from "model/presentation";
import PresentationType from "model/interfaces/presentation";
import {
  EditorPanel,
  EditorNavbar,
  PreviewSpace,
  SlideNavigator,
  FullScreenPresentation,
} from "components";
import { getDb } from "lib/db";
import { Slide } from "@model/slide";
import { useStore } from "lib/stores/EditorPage";

interface EditorPageProps {
  presentation: PresentationType;
  pid: string;
}

export function EditorPage(props: EditorPageProps) {
  const { pid, presentation } = props;

  const store = useStore();

  const { title } = presentation;
  const slides = useStore((state) => state.presentation.slides);
  const currentSlide = slides[store.currentSlideIdx];

  const getUpdateCurrentSlideFn = (
    field: keyof Slide,
    shouldDebounce = false
  ) => {
    const updateFn = (value: string) =>
      store.updateCurrentSlide(() => ({ [field]: value }));

    if (shouldDebounce) {
      return debounce(updateFn, 300);
    }

    return updateFn;
  };

  const updateBgColor = getUpdateCurrentSlideFn("bgColor", true);
  const updateFontColor = getUpdateCurrentSlideFn("fontColor", true);
  const updateMdContent = getUpdateCurrentSlideFn("mdContent");
  const updateFontFamily = getUpdateCurrentSlideFn("fontFamily");

  useEffect(() => {
    store.setPresentation(presentation);

    window.onkeydown = (e) => {
      if (typeof window !== "undefined") {
        const editorEl = window.document.querySelector<HTMLTextAreaElement>(
          ".w-md-editor-text-input"
        );

        if (window.document.activeElement === editorEl) {
          return;
        }
      }

      if (e.keyCode == 37) {
        store.goToPrevSlide();
      } else if (e.keyCode == 39) {
        store.goToNextSlide();
      }
    };
  }, []);

  return (
    <>
      <Head>
        <title>MSLIDE</title>
      </Head>
      {!store.isPresentationMode ? (
        <>
          <EditorNavbar title={title} pid={pid} />
          <Grid
            height={"calc(100vh - 70px)"}
            templateRows="repeat(12, 1fr)"
            templateColumns="repeat(3, 1fr)"
            as="main"
          >
            <GridItem rowSpan={12} colSpan={1}>
              <EditorPanel
                value={currentSlide.mdContent}
                bgColor={currentSlide.bgColor}
                setBgColor={updateBgColor}
                fontColor={currentSlide.fontColor}
                setFontColor={updateFontColor}
                setValue={updateMdContent}
                fontFamily={currentSlide.fontFamily}
                setFontFamily={updateFontFamily}
              />
            </GridItem>
            <GridItem rowSpan={11} colSpan={2}>
              <PreviewSpace
                fontFamily={currentSlide.fontFamily}
                bgColor={currentSlide.bgColor}
                fontColor={currentSlide.fontColor}
                mdContent={currentSlide.mdContent}
              />
            </GridItem>
            <GridItem rowSpan={1} colSpan={2}>
              <SlideNavigator
                onAddNewSlide={store.addNewSlide}
                currentSlide={store.currentSlideIdx}
                onClickSlide={store.goToSlide}
                slides={slides}
              />
            </GridItem>
          </Grid>{" "}
        </>
      ) : (
        <FullScreenPresentation
          slides={slides}
          currentSlideIdx={store.currentSlideIdx}
          onClose={store.stopPresentationMode}
        />
      )}
    </>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const { req, res, params } = ctx;
    const pid = params["pid"];

    const { user } = getSession(req, res);

    const db = await getDb();

    const collection = db.getCollection(PresentationModel);

    const presentation = await collection.findOne<PresentationModel>({
      userEmail: user.email,
      _id: new ObjectId(pid as string),
    });

    if (!presentation) {
      return {
        redirect: {
          destination: "/not-found",
          permanent: false,
        },
      };
    }

    const { _id, ...payload } = presentation as PresentationModel & {
      _id: ObjectId;
    };

    return {
      props: {
        presentation: { ...payload, id: _id.toHexString() },
        pid,
      },
    };
  },
});

export default EditorPage;
