import { createAdminClient } from "@/infrastructure/supabase/admin";
import { ShieldAlert, RefreshCw, Activity, Terminal } from "lucide-react";
import { formatDateCH } from "@/shared/utils/formatters";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const supabase = createAdminClient();

  const { data: logs, error } = await supabase
    .from("audit_logs")
    .select()
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <span className="text-[var(--gold)] uppercase tracking-[0.2em] text-[0.7rem] font-bold block mb-1">
            COMPLIANCE &amp; SECURITY
          </span>
          <h1 className="font-serif text-3xl md:text-4xl text-[var(--ink)] font-normal">
            Security Audit Logs
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Immutable system activity log tracking administrative changes, attendee registrations, and member updates
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-2 rounded-md">
          <ShieldAlert className="w-4 h-4 text-emerald-600" />
          <span>RLS &amp; Service Role Auditing Active</span>
        </div>
      </div>

      {/* Audit Logs Table */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-[#fcfaf5]">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-[var(--gold)]" />
            <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
              Recent System Activity (Last 100 Events)
            </span>
          </div>
          <span className="text-xs text-gray-400">
            Total records: {logs?.length ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#f8f6f0] text-xs uppercase font-bold text-gray-500 border-b border-gray-200">
              <tr>
                <th className="py-3 px-6">Timestamp</th>
                <th className="py-3 px-6">Action</th>
                <th className="py-3 px-6">Entity</th>
                <th className="py-3 px-6">Entity ID</th>
                <th className="py-3 px-6">Metadata Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-mono text-xs">
              {logs && logs.length > 0 ? (
                logs.map((log) => {
                  const isDelete = log.action.includes("delete");
                  const isCreate = log.action.includes("create") || log.action.includes("register");
                  const isUpdate = log.action.includes("update");

                  const badgeColor = isDelete
                    ? "bg-rose-100 text-rose-800"
                    : isCreate
                    ? "bg-emerald-100 text-emerald-800"
                    : isUpdate
                    ? "bg-amber-100 text-amber-900"
                    : "bg-gray-100 text-gray-700";

                  return (
                    <tr key={log.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-6 text-gray-500 whitespace-nowrap">
                        {new Date(log.created_at).toLocaleString("de-CH", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-6">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[0.68rem] uppercase font-bold tracking-wider ${badgeColor}`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-gray-700 font-sans text-xs">
                        {log.entity}
                      </td>
                      <td className="py-3 px-6 text-gray-400 truncate max-w-[120px]" title={log.entity_id || ""}>
                        {log.entity_id ? log.entity_id.substring(0, 8) + "..." : "—"}
                      </td>
                      <td className="py-3 px-6 text-gray-600 max-w-md truncate">
                        {log.details ? (
                          <span title={JSON.stringify(log.details, null, 2)}>
                            {JSON.stringify(log.details)}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-sans text-sm">
                    No security events recorded yet. Actions such as registrations, inquiry responses, and member additions will trigger audit logging.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-[#fdfcf9] border-t border-gray-200 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-gray-400" />
            <span>Encrypted PostgreSQL Event Bus</span>
          </div>
          <span>Region: Switzerland (Zurich eu-central-2)</span>
        </div>
      </div>
    </div>
  );
}
