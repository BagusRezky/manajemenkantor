import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AuthSimpleLayout from '@/layouts/auth/auth-simple-layout';

const ApprovalNotice = () => {
    return (
        <AuthSimpleLayout>
            <Card className="w-full max-w-lg">
                <CardHeader>
                    <CardTitle>Akun Anda dalam Peninjauan</CardTitle>
                    <CardDescription>
                        Terima kasih telah mendaftar. Akun Anda telah dibuat, tetapi perlu diaktifkan oleh administrator. Kami akan memberi tahu Anda
                        setelah akun Anda siap.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground text-center text-sm">Jika Anda memiliki pertanyaan, silakan hubungi administrator.</p>
                </CardContent>
            </Card>
        </AuthSimpleLayout>
    );
};

export default ApprovalNotice;
