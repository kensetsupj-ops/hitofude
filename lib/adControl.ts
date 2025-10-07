// 広告表示制御用のグローバルステート管理

type AdControlState = {
  mobileBottomStickyVisible: boolean;
  inArticleVisible: boolean;
  isEditMode: boolean;
};

const adControlState: AdControlState = {
  mobileBottomStickyVisible: false,
  inArticleVisible: false,
  isEditMode: false,
};

type AdControlListener = (state: AdControlState) => void;
const listeners: Set<AdControlListener> = new Set();

export const adControl = {
  getState: () => ({ ...adControlState }),

  setMobileBottomStickyVisible: (visible: boolean) => {
    adControlState.mobileBottomStickyVisible = visible;
    notifyListeners();
  },

  setInArticleVisible: (visible: boolean) => {
    adControlState.inArticleVisible = visible;
    notifyListeners();
  },

  setEditMode: (isEdit: boolean) => {
    adControlState.isEditMode = isEdit;
    notifyListeners();
  },

  // 同時表示チェック：モバイルスティッキーが表示中ならin-articleは非表示
  canShowInArticle: () => {
    return !adControlState.mobileBottomStickyVisible && !adControlState.isEditMode;
  },

  // 同時表示チェック：in-articleが表示中ならモバイルスティッキーは非表示
  canShowMobileBottomSticky: () => {
    return !adControlState.inArticleVisible;
  },

  subscribe: (listener: AdControlListener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

function notifyListeners() {
  const state = adControl.getState();
  listeners.forEach((listener) => listener(state));
}