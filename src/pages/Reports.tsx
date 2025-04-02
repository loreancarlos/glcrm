import React, { useState, useEffect, useMemo } from "react";
import { useAuthStore } from "../store/authStore";
import { useTeamStore } from "../store/teamStore";
import { useUserStore } from "../store/userStore";
import { useCallModeSessionStore } from "../store/callModeSessionStore";
import { useBusinessStore } from "../store/businessStore";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { ErrorMessage } from "../components/common/ErrorMessage";
import { ReportFilters } from "../components/reports/ReportFilters";
import { ReportSummary } from "../components/reports/ReportSummary";
import { ReportData } from "../types";

export function Reports() {
  const { user } = useAuthStore();
  const { teams, fetchTeams } = useTeamStore();
  const { users, fetchUsers } = useUserStore();
  const { businesses, fetchBusinesses } = useBusinessStore();
  const {
    sessions,
    loading: sessionsLoading,
    error: sessionsError,
    fetchSessions,
  } = useCallModeSessionStore();

  const [startDate, setStartDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split("T")[0]
  );
  const [endDate, setEndDate] = useState(
    new Date(new Date().setHours(0, 0, 0, 0)).toISOString().split("T")[0]
  );
  const [selectedTeam, setSelectedTeam] = useState("");
  const [selectedBroker, setSelectedBroker] = useState("");
  const [selectedSource, setSelectedSource] = useState("");

  useEffect(() => {
    fetchSessions();
    fetchTeams();
    fetchUsers();
    fetchBusinesses();
  }, [fetchSessions, fetchTeams, fetchUsers, fetchBusinesses]);

  // Filter brokers based on team selection and user role
  const availableBrokers = useMemo(() => {
    if (user?.role === "admin") {
      if (selectedTeam) {
        return users.filter(
          (u) =>
            (u.teamId === selectedTeam ||
              teams.find((t) => t.leaderId === u.id)?.id === selectedTeam) &&
            (u.role === "broker" || u.role === "teamLeader")
        );
      }
      return users.filter(
        (u) => (u.role === "broker" || u.role === "teamLeader") && u.active
      );
    } else if (user?.role === "teamLeader") {
      const leaderTeam = teams.find((t) => t.leaderId === user.id);
      return users.filter(
        (u) =>
          (u.teamId === leaderTeam?.id || leaderTeam?.leaderId === u.id) &&
          (u.role === "broker" || u.role === "teamLeader")
      );
    }
    return [];
  }, [users, selectedTeam, teams, user]);

  // Filter sessions based on date range, user role, and source
  const filteredSessions = useMemo(() => {
    let filtered = sessions.filter((session) => {
      const sessionDate = new Date(session.startTime);
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      start.setDate(start.getDate() + 1);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      end.setDate(end.getDate() + 1);
      return sessionDate >= start && sessionDate <= end;
    });

    if (user?.role === "admin") {
      if (selectedTeam) {
        const teamBrokerIds = availableBrokers.map((broker) => broker.id);
        filtered = filtered.filter((session) =>
          teamBrokerIds.includes(session.userId)
        );
      }
      if (selectedBroker) {
        filtered = filtered.filter(
          (session) => session.userId === selectedBroker
        );
      }
    } else if (user?.role === "teamLeader") {
      if (selectedBroker) {
        filtered = filtered.filter(
          (session) => session.userId === selectedBroker
        );
      } else {
        const teamBrokerIds = availableBrokers.map((broker) => broker.id);
        filtered = filtered.filter((session) =>
          teamBrokerIds.includes(session.userId)
        );
      }
    } else {
      filtered = filtered.filter((session) => session.userId === user?.id);
    }

    // Filter by source
    if (selectedSource) {
      filtered = filtered.filter((session) => {
        const sessionBusinesses = session.businessViewed.map(
          (businessId) => businesses.find((b) => b.id === businessId)?.source
        );
        return sessionBusinesses.some((source) => source === selectedSource);
      });
    }

    return filtered;
  }, [
    sessions,
    startDate,
    endDate,
    selectedTeam,
    selectedBroker,
    selectedSource,
    user,
    availableBrokers,
    businesses,
  ]);

  // Calculate report data
  const reportData: ReportData = useMemo(() => {
    return filteredSessions.reduce(
      (acc, session) => ({
        totalBusinessViewed:
          acc.totalBusinessViewed + session.businessViewed.length,
        answeredCalls: acc.answeredCalls + session.answeredCalls,
        talkedCalls: acc.talkedCalls + session.talkedCalls,
        scheduledCalls: acc.scheduledCalls + session.scheduledCalls,
        whatsappCalls: acc.whatsappCalls + session.whatsappCalls,
        notInterestCalls: acc.notInterestCalls + session.notInterestCalls,
        recallCalls: acc.recallCalls + session.recallCalls,
        voicemailCalls: acc.voicemailCalls + session.voicemailCalls,
        invalidNumberCalls: acc.invalidNumberCalls + session.invalidNumberCalls,
        notReceivingCalls: acc.notReceivingCalls + session.notReceivingCalls,
      }),
      {
        totalBusinessViewed: 0,
        answeredCalls: 0,
        talkedCalls: 0,
        scheduledCalls: 0,
        whatsappCalls: 0,
        notInterestCalls: 0,
        recallCalls: 0,
        voicemailCalls: 0,
        invalidNumberCalls: 0,
        notReceivingCalls: 0,
      }
    );
  }, [filteredSessions]);

  const handleTeamChange = (value: string) => {
    setSelectedTeam(value);
    setSelectedBroker("");
  };

  if (sessionsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Relatórios</h1>
      </div>

      <ReportFilters
        startDate={startDate}
        endDate={endDate}
        onStartDateChange={setStartDate}
        onEndDateChange={setEndDate}
        showTeamFilter={user?.role === "admin"}
        selectedTeam={selectedTeam}
        onTeamChange={handleTeamChange}
        teams={teams}
        showBrokerFilter={user?.role === "teamLeader" || user?.role === "admin"}
        selectedBroker={selectedBroker}
        onBrokerChange={setSelectedBroker}
        availableBrokers={availableBrokers}
        selectedSource={selectedSource}
        onSourceChange={setSelectedSource}
      />

      {sessionsError && <ErrorMessage message={sessionsError} />}

      <ReportSummary data={reportData} />
    </div>
  );
}
