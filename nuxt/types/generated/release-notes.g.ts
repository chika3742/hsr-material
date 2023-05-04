/* This file was generated. DO NOT edit by hand. */

export type ReleaseNotes = ReleaseNote[];

export interface ReleaseNote {
  /**
   * リリース日
   */
  date: string;
  /**
   * 機能バージョン
   */
  funcVersion: string;
  /**
   * データバージョン
   */
  dataVersion: string;
  /**
   * 更新内容
   */
  content: string;
  /**
   * メジャーバージョンアップかどうか
   */
  isMajor: boolean;
}
