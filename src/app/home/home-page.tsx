"use client";

import React from "react";
import { BottomSheet } from "@/shared/ui/bottom-sheet";
import { useBreakpoints } from "@/shared/hooks";
import { Modal } from "@/shared/ui/modal";
import s from "./home-page.module.scss";

export const HomePage = () => {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const { isMdUp, isHydrated } = useBreakpoints();

  const openDialog = () => setIsDialogOpen(true);
  const closeDialog = () => setIsDialogOpen(false);

  const DialogComponent = !isHydrated || isMdUp ? Modal : BottomSheet;

  return (
    <section className={s.root}>
      <h1 className={s.title}>main page</h1>

      <button type="button" onClick={openDialog} className={s.button}>
        Открыть форму заявки
      </button>

      <DialogComponent
        isOpen={isDialogOpen}
        onCloseAction={closeDialog}
        title="Заявка на передержку"
      >
        <h2 className={s.modalTitle}>Оставьте заявку</h2>
        <p className={s.modalText}>
          Выберите тип животного, укажите пол, загрузите фото и оставьте номер
          телефона с комментарием.
        </p>
      </DialogComponent>
    </section>
  );
};

export default HomePage;
