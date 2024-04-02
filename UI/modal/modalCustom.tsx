"use client";
import React, {
  Fragment,
  KeyboardEvent,
  ReactNode,
  useEffect,
  useState,
} from "react";
import ReactDOM from "react-dom";

export interface ModalCustomProps {
  name: string;
  buttonString?: {
    cancel: string;
    add: string;
  };
  changeButton?: boolean;
  design?: string;
  open: boolean;
  onClose: () => void;
  onClickEvent: () => void;
  children: React.ReactNode;
}

// name: 필수
export default function ModalCustom({
  name,
  buttonString = { cancel: "취소하기", add: "등록하기" },
  design = "",
  changeButton = false,
  open,
  onClose,
  onClickEvent,
  children,
}: ModalCustomProps) {
  const [prevScrollY, setPrevScrollY] = useState<number | undefined>(undefined);
  const [hasScrollbar, setHasScrollbar] = useState<boolean>(false);
  // 스크롤이 있는지 확인하는 함수
  const checkScrollbar = (): void => {
    setHasScrollbar(document.body.scrollHeight > window.innerHeight);
  };

  const keyDownHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!open) {
      return;
    }
    event.preventDefault();
    if (event.key === "Enter") {
      document.getElementById(`${name}AddButton`)?.click();
    } else if (event.key === "Escape") {
      document.getElementById(`${name}CancelButton`)?.click();
    }
  };

  useEffect((): void => {
    checkScrollbar();
    // 스크롤을 방지하고 현재 위치를 반환
    const preventScroll = (): void => {
      const currentScrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.width = "100%";
      document.body.style.top = `-${currentScrollY}px`; // 현재 스크롤 위치
      document.body.style.overflowY = hasScrollbar ? "scroll" : "hidden";
      setPrevScrollY(currentScrollY);
    };

    // 스크롤을 허용하고, 스크롤 방지 함수에서 반환된 위치로 이동
    const allowScroll = (): void => {
      document.body.style.position = "";
      document.body.style.width = "";
      document.body.style.top = "";
      document.body.style.overflowY = "";
      if (prevScrollY !== undefined) {
        window.scrollTo(0, prevScrollY);
      }
    };
    // 모달이 열릴 때마다 스크롤바 여부를 확인하고, 스크롤 방지/허용 함수 호출
    if (open) {
      checkScrollbar();
      preventScroll();
    } else {
      allowScroll();
    }
  }, [open, hasScrollbar, prevScrollY]);

  if (!open) return null;

  return ReactDOM.createPortal(
    <Fragment>
      <div
        className="fixed top-0 bottom-0 left-0 right-0 z-50 bg-black bg-opacity-40"
        onClick={onClose}
      />
      <div
        tabIndex={0}
        onKeyDown={keyDownHandler}
        className={`fixed z-50 px-20 py-12 transform -translate-x-1/2 -translate-y-1/2 bg-white top-1/2 left-1/2 rounded-xl outline-none ${design}`}
      >
        {children}
        <div className="flex justify-center mt-5 ">
          <button
            id={`${name}CancelButton`}
            onClick={onClose}
            className={`px-12 py-2 mr-6 text-sm font-semibold rounded-md text-neutral-100  ring-1 ring-inset ring-f5red-700/10 ${changeButton ? "bg-f5green-350 hover:bg-f5green-300" : "bg-f5red-350 hover:bg-f5red-300"}`}
          >
            {buttonString.cancel}
          </button>
          <button
            id={`${name}AddButton`}
            onClick={() => {
              onClickEvent();
              onClose();
            }}
            type="button"
            className={`px-12 py-2 text-sm font-semibold rounded-md text-neutral-100  ring-1 ring-inset ring-f5green-700/10 ${changeButton ? "bg-f5red-350 hover:bg-f5red-300" : "bg-f5green-350 hover:bg-f5green-300"}`}
          >
            {buttonString.add}
          </button>
        </div>
      </div>
    </Fragment>,
    document.getElementById("globalModal") as HTMLElement
  );
}

// TypeScript 와 react사용 , 모달 자체는 Nextjs에서 사용
// globalModal이라는것을 root app 밑에 넣어두어 거기에 끼워넣는 식으로 진행
// NextJs는 intercept page가 있어서 이를 이용해 모달 구현이 가능하지만 과거방식으로 구현한 것에 nextJs 방식으로 진행
// TailwindCSS 기반으로 스타일링