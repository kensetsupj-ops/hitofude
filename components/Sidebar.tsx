'use client';

import { Guide } from '@/lib/types';
import { useState, useEffect } from 'react';

interface SidebarProps {
  guide: Guide;
  onGuideChange: (guide: Guide) => void;
  onSearchAddress?: () => void;
}

export default function Sidebar({ guide, onGuideChange, onSearchAddress }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  // guideのmetaデータをそのまま使用
  const [editValues, setEditValues] = useState(guide.meta);

  // guide.metaが変更されたときにeditValuesも更新
  useEffect(() => {
    setEditValues(guide.meta);
  }, [guide.meta]);

  const handleInputChange = (field: keyof typeof editValues, value: any) => {
    const newValues = { ...editValues, [field]: value };
    setEditValues(newValues);
    onGuideChange({
      ...guide,
      meta: newValues,
    });
  };

  const handleSearchAddress = () => {
    if (editValues.address && editValues.address.trim() !== '') {
      onGuideChange({
        ...guide,
        meta: editValues,
      });
      // 検索トリガーを実行
      if (onSearchAddress) {
        onSearchAddress();
      }
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">搬入案内情報</h2>
        <button
          className="collapse-button"
          onClick={() => setIsExpanded(!isExpanded)}
          title={isExpanded ? '折りたたむ' : '展開する'}
        >
          {isExpanded ? '－' : '＋'}
        </button>
      </div>

      {isExpanded && (
        <div className="sidebar-content">
          {/* 基本情報セクション */}
          <section className="form-section">
            <h3 className="section-title">基本情報</h3>

            <div className="form-group">
              <label className="form-label">案件名 *</label>
              <input
                type="text"
                placeholder="例：〇〇ビル新築工事"
                className="form-input"
                value={editValues.title || ''}
                onChange={(e) => handleInputChange('title', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">搬入日</label>
                <input
                  type="date"
                  className="form-input"
                  value={editValues.date || ''}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">時間帯</label>
                <input
                  type="text"
                  placeholder="9:00-17:00"
                  className="form-input"
                  value={editValues.time || ''}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group address-group">
              <label className="form-label">現場住所 *</label>
              <div className="address-input-row">
                <input
                  type="text"
                  placeholder="東京都千代田区丸の内1-1-1"
                  className="form-input"
                  value={editValues.address || ''}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleSearchAddress();
                    }
                  }}
                />
                <button
                  onClick={handleSearchAddress}
                  className="search-button"
                  title="住所を検索して地図を移動"
                >
                  検索
                </button>
              </div>
              <span className="form-hint">Enterで地図を検索</span>
            </div>

            <div className="form-group">
              <label className="form-label">現場名</label>
              <input
                type="text"
                placeholder="例：1F搬入口前"
                className="form-input"
                value={editValues.site || ''}
                onChange={(e) => handleInputChange('site', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">責任者</label>
                <input
                  type="text"
                  placeholder="山田太郎"
                  className="form-input"
                  value={editValues.supervisor || ''}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">当日直通</label>
                <input
                  type="tel"
                  placeholder="090-1234-5678"
                  className="form-input"
                  value={editValues.phone || ''}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                />
              </div>
            </div>
          </section>

          {/* スケジュールセクション */}
          <section className="form-section">
            <h3 className="section-title">スケジュール</h3>

            <div className="form-group">
              <label className="form-label">集合時刻・場所</label>
              <input
                type="text"
                placeholder="8:30 現場近くのコンビニ"
                className="form-input"
                value={editValues.gather || ''}
                onChange={(e) => handleInputChange('gather', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">現場着</label>
                <input
                  type="text"
                  placeholder="9:00"
                  className="form-input"
                  value={editValues.arrive || ''}
                  onChange={(e) => handleInputChange('arrive', e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">荷下ろし</label>
                <input
                  type="text"
                  placeholder="9:30-11:00"
                  className="form-input"
                  value={editValues.unload || ''}
                  onChange={(e) => handleInputChange('unload', e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">退出予定</label>
              <input
                type="text"
                placeholder="11:30"
                className="form-input"
                value={editValues.leave || ''}
                onChange={(e) => handleInputChange('leave', e.target.value)}
              />
            </div>
          </section>

          {/* 車両情報セクション */}
          <section className="form-section">
            <h3 className="section-title">車両情報</h3>

            <div className="form-group">
              <label className="form-label">車種</label>
              <input
                type="text"
                placeholder="4tトラック"
                className="form-input"
                value={editValues.vehicle || ''}
                onChange={(e) => handleInputChange('vehicle', e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">台数</label>
                <input
                  type="number"
                  placeholder="2"
                  className="form-input"
                  value={editValues.units || ''}
                  onChange={(e) => handleInputChange('units', parseInt(e.target.value) || undefined)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">総重量(t)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="8.0"
                  className="form-input"
                  value={editValues.gross_t || ''}
                  onChange={(e) => handleInputChange('gross_t', parseFloat(e.target.value) || undefined)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">荷姿</label>
              <input
                type="text"
                placeholder="パレット積み"
                className="form-input"
                value={editValues.load || ''}
                onChange={(e) => handleInputChange('load', e.target.value)}
              />
            </div>
          </section>

          {/* 制限事項セクション */}
          <section className="form-section">
            <h3 className="section-title">制限事項</h3>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">高さ制限(mm)</label>
                <input
                  type="number"
                  placeholder="3800"
                  className="form-input"
                  value={editValues.h_limit_mm || ''}
                  onChange={(e) => handleInputChange('h_limit_mm', parseInt(e.target.value) || undefined)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">幅員(m)</label>
                <input
                  type="number"
                  step="0.1"
                  placeholder="5.0"
                  className="form-input"
                  value={editValues.w_limit_m || ''}
                  onChange={(e) => handleInputChange('w_limit_m', parseFloat(e.target.value) || undefined)}
                />
              </div>
            </div>
          </section>

          {/* 注意事項セクション */}
          <section className="form-section">
            <h3 className="section-title">注意事項</h3>

            <div className="form-group">
              <textarea
                placeholder="・搬入口は建物裏側&#10;・朝は道路混雑あり&#10;・警備員に声かけ必須"
                className="form-textarea"
                value={editValues.notes || ''}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={5}
              />
            </div>
          </section>
        </div>
      )}

      <style jsx>{`
        .sidebar {
          width: 380px;
          background: #f9f9f9;
          border-left: 1px solid #ddd;
          display: flex;
          flex-direction: column;
          height: 100%;
          min-height: 0;
          overflow: hidden;
        }

        .sidebar-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #333;
          border-bottom: 1px solid #000;
        }

        .sidebar-title {
          font-size: 14px;
          font-weight: bold;
          margin: 0;
          color: #fff;
        }

        .collapse-button {
          background: transparent;
          border: 1px solid #fff;
          color: white;
          cursor: pointer;
          padding: 2px 8px;
          font-size: 14px;
        }

        .collapse-button:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .sidebar-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          min-height: 0;
        }

        .form-section {
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 1px solid #ddd;
        }

        .form-section:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        .section-title {
          font-size: 13px;
          font-weight: bold;
          margin: 0 0 10px 0;
          color: #333;
          padding-left: 8px;
          border-left: 3px solid #333;
        }

        .form-group {
          margin-bottom: 10px;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 10px;
        }

        .form-label {
          display: block;
          font-size: 12px;
          font-weight: normal;
          color: #333;
          margin-bottom: 4px;
        }

        .form-input,
        .form-textarea {
          width: 100%;
          padding: 6px 8px;
          border: 1px solid #ccc;
          font-size: 12px;
          font-family: inherit;
        }

        .form-input:focus,
        .form-textarea:focus {
          outline: none;
          border-color: #333;
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
          line-height: 1.4;
        }

        .address-group {
          background: #fffce0;
          border: 1px solid #e0d000;
          padding: 8px;
          margin-bottom: 10px;
        }

        .address-input-row {
          display: flex;
          gap: 4px;
        }

        .search-button {
          flex-shrink: 0;
          background: #333;
          color: white;
          border: none;
          padding: 6px 12px;
          cursor: pointer;
          font-size: 12px;
        }

        .search-button:hover {
          background: #555;
        }

        .form-hint {
          display: block;
          font-size: 11px;
          color: #666;
          margin-top: 4px;
        }

        @media print {
          .sidebar {
            display: none;
          }
        }

        @media (max-width: 768px) {
          .sidebar {
            width: 100%;
            border-left: none;
            border-top: 1px solid #ddd;
          }
        }
      `}</style>
    </aside>
  );
}