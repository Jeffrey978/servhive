import Ionicons from '@expo/vector-icons/Ionicons';
import { useQuery } from '@tanstack/react-query';
import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';
import { LayoutAnimation, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { SkeletonCards } from '@/components/skeleton';
import { Badge, ErrorState, Notice, T } from '@/components/ui';
import { useApiFetch } from '@/lib/api';
import { date, STATUS } from '@/lib/format';
import { fonts, radius, space, useColors } from '@/theme';

/**
 * The guides and legal pages, shown inside the app in a slide-up sheet instead
 * of opening the website. Text comes from the website's /api/v1/content, so it
 * always matches what the site says (and lawyer edits show up without an app update).
 *
 *   const info = useInfoSheet();
 *   info.open('legal:privacy');   // 'legal:terms' | 'legal:provider' | 'legal:protection' | 'legal:privacy'
 *   info.open('guide:client');    // 'guide:pro'
 */

export type InfoKey = 'guide:client' | 'guide:pro' | 'legal:terms' | 'legal:provider' | 'legal:protection' | 'legal:privacy';

type LegalDoc = { slug: string; title: string; summary: string; updated: string; notice: string; sections: { id: string; heading: string; body: string[] }[] };
type Content = {
  legal: Record<'terms' | 'provider' | 'protection' | 'privacy', LegalDoc>;
  guides: {
    client: { title: string; steps: { title: string; body: string; status: string | null }[]; disputes: string[]; faq: { q: string; a: string }[] };
    pro: { title: string; benefits: { title: string; body: string }[]; pricing: { k: string; v: string; note: string }[] };
  };
};

const Ctx = createContext<{ open: (k: InfoKey) => void }>({ open: () => {} });
export const useInfoSheet = () => useContext(Ctx);

export function InfoSheetProvider({ children }: { children: ReactNode }) {
  const [key, setKey] = useState<InfoKey | null>(null);
  const open = useCallback((k: InfoKey) => setKey(k), []);
  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <Sheet k={key} onClose={() => setKey(null)} onOpen={setKey} />
    </Ctx.Provider>
  );
}

function useContent(enabled: boolean) {
  const apiFetch = useApiFetch();
  return useQuery({ queryKey: ['content'], queryFn: () => apiFetch<Content>('/content'), enabled, staleTime: 60 * 60_000 });
}

function Sheet({ k, onClose, onOpen }: { k: InfoKey | null; onClose: () => void; onOpen: (k: InfoKey) => void }) {
  const c = useColors();
  const insets = useSafeAreaInsets();
  const q = useContent(!!k);
  const legal = k?.startsWith('legal:') ? q.data?.legal[k.slice(6) as keyof Content['legal']] : undefined;
  const title = legal?.title ?? (k === 'guide:client' ? q.data?.guides.client.title : k === 'guide:pro' ? q.data?.guides.pro.title : '') ?? '';

  return (
    <Modal visible={!!k} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: c.bg, paddingTop: Platform.OS === 'android' ? insets.top : 0 }}>
        {Platform.OS === 'ios' ? <View style={{ alignSelf: 'center', width: 38, height: 5, borderRadius: 3, backgroundColor: c.border, marginTop: 8 }} /> : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingTop: space.md, paddingBottom: space.sm }}>
          <T v="h2" style={{ flex: 1 }} numberOfLines={2}>
            {title || ' '}
          </T>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Close"
            onPress={onClose}
            hitSlop={10}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: c.surface2, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="close" size={20} color={c.text} />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={{ padding: space.lg, paddingTop: space.sm, gap: space.lg, paddingBottom: insets.bottom + space.xxl }}>
          {q.isPending ? (
            <SkeletonCards count={5} />
          ) : q.error || !q.data ? (
            <ErrorState error={q.error} onRetry={() => q.refetch()} />
          ) : legal ? (
            <LegalBody doc={legal} />
          ) : k === 'guide:client' ? (
            <ClientGuide g={q.data.guides.client} onOpen={onOpen} />
          ) : k === 'guide:pro' ? (
            <ProGuide g={q.data.guides.pro} onOpen={onOpen} />
          ) : null}
        </ScrollView>
      </View>
    </Modal>
  );
}

/** A tap-to-expand row, like a drop-down. */
function Accordion({ title, children, defaultOpen = false }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  const c = useColors();
  const [open, setOpen] = useState(defaultOpen);
  return (
    <View style={{ backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.border, overflow: 'hidden' }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
          setOpen((o) => !o);
        }}
        style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.md, padding: space.lg, backgroundColor: pressed ? c.surface2 : 'transparent' })}>
        <T v="bodyStrong" style={{ flex: 1 }}>
          {title}
        </T>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={c.muted} />
      </Pressable>
      {open ? <View style={{ paddingHorizontal: space.lg, paddingBottom: space.lg, gap: space.sm }}>{children}</View> : null}
    </View>
  );
}

function Numbered({ n, title, body, badge }: { n: number; title?: string; body: string; badge?: string | null }) {
  const c = useColors();
  return (
    <View style={{ flexDirection: 'row', gap: space.md }}>
      <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: c.accentSoft, alignItems: 'center', justifyContent: 'center' }}>
        <T v="small" style={{ fontFamily: fonts.semibold, color: c.accent }}>
          {n}
        </T>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        {title ? <T v="bodyStrong">{title}</T> : null}
        <T v="small" color="muted">
          {body}
        </T>
        {badge && STATUS[badge] ? <Badge label={STATUS[badge][0]} tone={STATUS[badge][1]} /> : null}
      </View>
    </View>
  );
}

function LegalBody({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Notice tone="info">{doc.notice}</Notice>
      <T v="small" color="muted">
        {doc.summary}
      </T>
      <T v="caption">Updated {date(doc.updated)}</T>
      <View style={{ gap: space.sm }}>
        {doc.sections.map((s, i) => (
          <Accordion key={s.id} title={`${String(i + 1).padStart(2, '0')}  ${s.heading}`} defaultOpen={i === 0}>
            {s.body.map((para, j) => (
              <T key={j} v="small">
                {para}
              </T>
            ))}
          </Accordion>
        ))}
      </View>
    </>
  );
}

function ClientGuide({ g, onOpen }: { g: Content['guides']['client']; onOpen: (k: InfoKey) => void }) {
  return (
    <>
      <T v="label">How a job runs</T>
      <View style={{ gap: space.lg }}>
        {g.steps.map((s, i) => (
          <Numbered key={s.title} n={i + 1} title={s.title} body={s.body} badge={s.status} />
        ))}
      </View>
      <T v="label">When something goes wrong</T>
      <View style={{ gap: space.md }}>
        {g.disputes.map((d, i) => (
          <Numbered key={i} n={i + 1} body={d} />
        ))}
      </View>
      <T v="label">Questions</T>
      <View style={{ gap: space.sm }}>
        {g.faq.map((f) => (
          <Accordion key={f.q} title={f.q}>
            <T v="small">{f.a}</T>
          </Accordion>
        ))}
      </View>
      <LinkRow title="Payment Protection Terms" onPress={() => onOpen('legal:protection')} />
    </>
  );
}

function ProGuide({ g, onOpen }: { g: Content['guides']['pro']; onOpen: (k: InfoKey) => void }) {
  const c = useColors();
  return (
    <>
      <T v="label">Why join</T>
      <View style={{ gap: space.lg }}>
        {g.benefits.map((b, i) => (
          <Numbered key={b.title} n={i + 1} title={b.title} body={b.body} />
        ))}
      </View>
      <T v="label">Pricing</T>
      <View style={{ backgroundColor: c.surface, borderRadius: radius.md, borderWidth: 1, borderColor: c.border }}>
        {g.pricing.map((p, i) => (
          <View key={p.k} style={{ padding: space.lg, gap: 4, borderTopWidth: i ? 1 : 0, borderTopColor: c.border }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: space.md }}>
              <T v="bodyStrong">{p.k}</T>
              <T v="bodyStrong" color="accent">
                {p.v}
              </T>
            </View>
            <T v="small" color="muted">
              {p.note}
            </T>
          </View>
        ))}
      </View>
      <LinkRow title="Provider Agreement" onPress={() => onOpen('legal:provider')} />
    </>
  );
}

function LinkRow({ title, onPress }: { title: string; onPress: () => void }) {
  const c = useColors();
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => ({ flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingVertical: space.sm, opacity: pressed ? 0.6 : 1 })}>
      <Ionicons name="document-text-outline" size={18} color={c.accent} />
      <T color="accent" style={{ flex: 1 }}>
        Read the {title}
      </T>
      <Ionicons name="chevron-forward" size={16} color={c.accent} />
    </Pressable>
  );
}
