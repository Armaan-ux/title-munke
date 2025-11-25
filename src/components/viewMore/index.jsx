export default function OrganizationRoleOverview() {
  return (
    <div className="min-h-screen w-full bg-coffee-bg-billing-foreground p-4 md:p-8 [&_h1]:text-secondary [&_h2]:text-secondary 
    [&_p]:text-secondary [&_h3]:text-secondary"
    >
      <div className="text-gray-900 leading-relaxed space-y-6">

        {/* EXACT PDF TITLE */}
        <h1 className="text-2xl md:text-4xl font-bold text-center">
          Organization Role Overview for Title Munke
        </h1>

        {/* EXACT PDF CONTENT */}
        <p>
          The Organization role in Title Munke is designed for large real estate associations and 
          groups, such as Greater Lehigh Valley REALTORS, that oversee multiple brokerages under 
          a single umbrella. This role provides a clear, structured view of every brokerage assigned to 
          that organization while maintaining strict access boundaries so users only see the 
          brokerages within their own organization.
        </p>

        {/* SECTION */}
        <h2 className="text-lg font-semibold">Visibility and Structure</h2>

        <p>
          Users with an Organization role can view all brokerages that are tied to their organization. 
          For each brokerage, they can see the brokers assigned to it, and for each broker, they can 
          see all associated agents and their activity. This mirrors the existing broker-level structure 
          but expands it across the full organization.
        </p>

        <p>Both Organization Admins and Organization Users have access to:</p>

        {/* EXACT BULLETS (● AND ○) */}
        <div className="space-y-1">
          <p>● A complete list of brokerages assigned to the organization</p>
          <p>● Broker-level views for each brokerage</p>
          <p>● Agent-level activity for every agent under each broker</p>
          <p>● Search and usage activity across the organization, including:</p>

          <div className="ml-6 space-y-1">
            <p>○ Search count per brokerage</p>
            <p>○ Search count per broker</p>
            <p>○ Search count per agent</p>
            <p>○ Search status (pending, completed, failed)</p>
            <p>○ Billing and usage metrics</p>
          </div>
        </div>

        {/* Role Types */}
        <h2 className="text-lg font-semibold">Role Types</h2>
        <p>There are two organization-level roles:</p>

        {/* Organization Admin */}
        <h3 className="text-lg font-semibold">Organization Admin</h3>

        <p>
          An Organization Admin has full management control across the brokerages assigned to the 
          organization. This includes the ability to:
        </p>

        <div className="space-y-1">
          <p>● Add or remove brokerages</p>
          <p>● Add or remove brokers</p>
          <p>● Add or remove agents</p>
          <p>● Reassign agents or brokers across brokerages</p>
          <p>● Manage billing and usage settings</p>
          <p>● Receive organization-wide activity and usage reports</p>
          <p>● Access an aggregated dashboard that mirrors the broker dashboard but combines 
            activity from all brokerages</p>
        </div>

        {/* Organization User */}
        <h3 className="text-lg font-semibold">Organization User</h3>

        <p>
          An Organization User has view-only access to the same organizational structure and activity. 
          This includes:
        </p>

        <div className="space-y-1">
          <p>● Viewing all assigned brokerages, brokers, and agents</p>
          <p>● Viewing all activity, searches, and usage metrics</p>
          <p>● Reassigning agents or brokers with standard internal permissions</p>
        </div>

        <p>
          Organization Users cannot add or remove brokerages, brokers, or agents and cannot 
          manage billing.
        </p>

        {/* Access Boundaries */}
        <h2 className="text-lg font-semibold">Access Boundaries</h2>

        <p>
          Organization roles are strictly limited to the brokerages assigned to that specific 
          organization. Users cannot view or interact with any brokerages or agents outside their own 
          organization.
        </p>

        {/* Additional Notes */}
        <h2 className="text-lg font-semibold">Additional Notes and Hierarchy Clarification</h2>

        <h3 className="text-lg font-semibold">Overall System Hierarchy</h3>

        <p>
          To avoid confusion between role types, here is the full hierarchy of access levels within Title 
          Munke:
        </p>

        <p className="font-semibold">System Admin (Global Admin) → Organization Admin → Organization User → Broker → Agent</p>

        <div className="space-y-2">
          <div>
            <h2 className="text-lg font-semibold">● System Admin (Global Admin):</h2> 
            <p>
                Already developed. This role has unrestricted access across 
                all organizations, brokerages, brokers, agents, searches, and billing data within the entire 
                Title Munke platform. This role sits above every other user type and is not limited by 
                organizational boundaries.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">● Organization Admin / Organization User:</h2>
            <p> These roles operate only within the brokerages 
            assigned to their specific organization. They do not have platform-wide visibility or 
            permissions.</p>
          </div>
        </div>

        {/* Critical Notes */}
        <h2 className="text-lg font-semibold">Critical Implementation Notes</h2>
        <p>To ensure strict separation of access levels:</p>
        {/* NUMBERED EXACTLY LIKE PDF */}
        <div className="space-y-4 ml-1">
          <div>
            <h2 className="text-lg font-semibold">1. Enforce Organization Boundaries at Every Data Layer</h2>
            All queries, AdivI endpoints, and drill-down views must be filtered by 
            organization_id unless the user is a Global Admin. This prevents leakage of 
            brokerages or agents across organizations.
          </div>

          <div>
            <h2 className="text-lg font-semibold">2. Reassignment Rules Must Validate Organization Ownershidiv</h2>
            When moving brokers or agents, the system must validate:
            <div className="space-y-1">
            <p>○ The origin brokerage belongs to the user’s organization</p>
            <p>○ The destination brokerage also belongs to the same organization</p>
            <p>○ Only Global Admins may move users across different organizations</p>
            </div>  
          </div>

          <div>
            <h2 className="text-lg font-semibold">3. Aggregated Metrics Should Never Include External Data</h2>
            <p>Organization-level analytics and billing must aggregate only from the brokerages 
            assigned to that organization.</p>
            <p>Global Admins are the only users who should ever see system-wide totals.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">4. Broker & Agent Roles Remain Unchanged</h2> 
            Organization-level roles simply layer on top of existing broker/agent functionality and 
            should not alter permissions for those lower roles.
          </div>

          <div>
            <h2 className="text-lg font-semibold">5. Audit Logging Recommendation (Optional but Ideal)</h2>
            For transparency and debugging—especially with reassignment and billing 
            permissions—implement simple activity logs for:
            <div className="space-y-1">
                <p>○ Organization Admin actions</p>
                <p>○ Organization User reassignment actions</p> 
                <p>○ Any cross-brokerage modifications</p>
                <p>○ This protects against misconfiguration and helps with support issues.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
