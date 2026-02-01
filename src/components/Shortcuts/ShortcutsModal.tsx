import { Modal } from '../UI';

interface ShortcutsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ShortcutsModal({ isOpen, onClose }: ShortcutsModalProps) {
    const shortcuts = [
        { key: 'Space', action: 'Start / Pause Timer' },
        { key: 'R', action: 'Reset Timer' },
        { key: 'S', action: 'Skip to Next Session' },
        { key: '↑', action: 'Increase Time (+5 min)' },
        { key: '↓', action: 'Decrease Time (-5 min)' },
        { key: '→', action: 'Next Mode' },
        { key: '←', action: 'Previous Mode' },
        { key: 'Esc', action: 'Close Modal' },
    ];

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Keyboard Shortcuts" size="sm">
            <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {shortcuts.map((shortcut, index) => (
                        <div
                            key={index}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                padding: '12px 16px',
                                background: 'rgba(255,255,255,0.03)',
                                borderRadius: '8px',
                                border: '1px solid rgba(255,255,255,0.06)',
                            }}
                        >
                            <span style={{ color: '#888888', fontSize: '14px' }}>{shortcut.action}</span>
                            <div
                                style={{
                                    padding: '4px 12px',
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: '6px',
                                    border: '1px solid rgba(255,255,255,0.15)',
                                    color: '#ffffff',
                                    fontSize: '13px',
                                    fontWeight: 500,
                                    fontFamily: 'monospace',
                                }}
                            >
                                {shortcut.key}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
}
