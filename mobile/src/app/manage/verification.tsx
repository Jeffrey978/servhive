import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { Button, Card, Divider, Field, Gap, Notice, QueryView, Row, Screen, Section, StatusBadge, T } from '@/components/ui';
import { errorMessage, useApi } from '@/lib/api';
import { date } from '@/lib/format';
import { pickImage } from '@/lib/images';
import type { ProVerification } from '@/lib/types';
import { useSubmit } from '@/lib/use-submit';
import { space, useColors } from '@/theme';

const FIX: Record<string, string> = { photos: '/manage/photos', payout: '/manage/payout' };

/**
 * ID and licence uploads and the review request (website: /pro/verification).
 * Documents go to Servhive's private store and are never shown to clients.
 */
export default function Verification() {
  const q = useApi<ProVerification>(['pro', 'verification'], '/pro/verification');
  return (
    <Screen keyboard onRefresh={() => q.refetch()} refreshing={q.isRefetching}>
      <QueryView query={q}>{(d) => <Body d={d} />}</QueryView>
    </Screen>
  );
}

function Body({ d }: { d: ProVerification }) {
  const c = useColors();
  const submit = useSubmit('pro.submitForReview');
  const editable = d.status === 'DRAFT' || d.status === 'REJECTED';

  return (
    <Gap size={space.lg}>
      <Card style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <T v="h3">Profile status</T>
        <StatusBadge status={d.status} />
      </Card>
      {d.status === 'REJECTED' && d.rejectionReason ? <Notice tone="danger" title="What to fix">{d.rejectionReason}</Notice> : null}
      {d.status === 'UNDER_REVIEW' ? <Notice tone="info">We're checking your documents. We usually review within 1–2 working days.</Notice> : null}

      <Section title="Checklist">
        <Card style={{ paddingVertical: space.xs }}>
          {d.items.map((it, i) => (
            <View key={it.key}>
              {i > 0 ? <Divider /> : null}
              <Row
                left={<Ionicons name={it.done ? 'checkmark-circle' : 'ellipse-outline'} size={24} color={it.done ? c.success : c.faint} />}
                title={it.label}
                subtitle={it.meta ?? (it.required ? null : 'Optional for review')}
                onPress={FIX[it.key] ? () => router.push(FIX[it.key] as '/manage/photos') : undefined}
              />
            </View>
          ))}
        </Card>
      </Section>

      <DocUpload kind="GOVERNMENT_ID" title="Government ID" body="NIN slip, national ID card, driver's licence or passport. Make sure your name and photo are clear." d={d} editable={editable} />
      {d.needsLicence ? <DocUpload kind="TRADE_LICENCE" title="Trade licence" body="Your trade needs a valid licence. Add the licence number too." d={d} editable={editable} /> : null}

      {editable ? (
        <Gap>
          {submit.error ? <Notice tone="danger">{submit.error}</Notice> : null}
          <Button title="Submit for review" disabled={!d.canSubmit} loading={submit.pending} onPress={() => submit.submit({})} />
          {!d.canSubmit ? <T v="caption">Finish the required items first.</T> : null}
        </Gap>
      ) : null}
    </Gap>
  );
}

function DocUpload({
  kind,
  title,
  body,
  d,
  editable,
}: {
  kind: 'GOVERNMENT_ID' | 'TRADE_LICENCE';
  title: string;
  body: string;
  d: ProVerification;
  editable: boolean;
}) {
  const upload = useSubmit('pro.uploadDocument');
  const doc = d.docs.find((x) => x.kind === kind);
  const [licenceNumber, setLicenceNumber] = useState(doc?.licenceNumber ?? '');
  const [pickError, setPickError] = useState<string | null>(null);

  async function choose(source: 'camera' | 'library') {
    setPickError(null);
    try {
      const img = await pickImage(source, { maxWidth: 1600 });
      if (!img) return;
      await upload.submit({ kind, dataUrl: img.dataUrl, fileName: img.fileName, licenceNumber: kind === 'TRADE_LICENCE' ? licenceNumber : undefined });
    } catch (e) {
      setPickError(errorMessage(e));
    }
  }

  return (
    <Section title={title}>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <T v="bodyStrong">{doc ? doc.fileName : 'Not uploaded'}</T>
          <StatusBadge status={doc?.status ?? 'NOT_UPLOADED'} />
        </View>
        {doc ? <T v="caption">Uploaded {date(doc.submittedAt)}</T> : null}
        {doc?.status === 'REJECTED' && doc.rejectionReason ? <Notice tone="danger">{doc.rejectionReason}</Notice> : null}
        <T v="small" color="muted">
          {body}
        </T>
        {kind === 'TRADE_LICENCE' && editable ? <Field label="Licence number" value={licenceNumber} onChangeText={setLicenceNumber} maxLength={60} /> : null}
        {pickError || upload.error ? <Notice tone="danger">{pickError ?? upload.error}</Notice> : null}
        {editable && doc?.status !== 'APPROVED' ? (
          <View style={{ flexDirection: 'row', gap: space.sm }}>
            <Button title="Take photo" kind="secondary" icon="camera-outline" small style={{ flex: 1 }} loading={upload.pending} onPress={() => choose('camera')} />
            <Button title={doc ? 'Replace' : 'Choose file'} kind="secondary" icon="document-outline" small style={{ flex: 1 }} loading={upload.pending} onPress={() => choose('library')} />
          </View>
        ) : null}
        <T v="caption">Private: only the Servhive team sees this. It's never shown on your profile.</T>
      </Card>
    </Section>
  );
}
