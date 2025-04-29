import type {
  BaseClientOptions,
  SchemaInference,
  XataRecord,
} from "@xata.io/client";
declare const tables: readonly [
  {
    readonly name: "maps_scores";
    readonly checkConstraints: {
      readonly maps_scores_xata_id_length_xata_id: {
        readonly name: "maps_scores_xata_id_length_xata_id";
        readonly columns: readonly ["xata_id"];
        readonly definition: "CHECK ((length(xata_id) < 256))";
      };
    };
    readonly foreignKeys: {};
    readonly primaryKey: readonly [];
    readonly uniqueConstraints: {
      readonly _pgroll_new_maps_scores_xata_id_key: {
        readonly name: "_pgroll_new_maps_scores_xata_id_key";
        readonly columns: readonly ["xata_id"];
      };
    };
    readonly columns: readonly [
      {
        readonly name: "Duration";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Map";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Match_Name";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Match_Type";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Stage";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_A";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_A_Attacker_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_A_Defender_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_A_Overtime_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_A_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_B";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_B_Attacker_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_B_Defender_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_B_Overtime_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Team_B_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Tournament";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "xata_createdat";
        readonly type: "datetime";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "now()";
        readonly comment: "";
      },
      {
        readonly name: "xata_id";
        readonly type: "text";
        readonly notNull: true;
        readonly unique: true;
        readonly defaultValue: "('rec_'::text || (xata_private.xid())::text)";
        readonly comment: "";
      },
      {
        readonly name: "xata_updatedat";
        readonly type: "datetime";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "now()";
        readonly comment: "";
      },
      {
        readonly name: "xata_version";
        readonly type: "int";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "0";
        readonly comment: "";
      }
    ];
  },
  {
    readonly name: "players_stats";
    readonly checkConstraints: {
      readonly players_stats_xata_id_length_xata_id: {
        readonly name: "players_stats_xata_id_length_xata_id";
        readonly columns: readonly ["xata_id"];
        readonly definition: "CHECK ((length(xata_id) < 256))";
      };
    };
    readonly foreignKeys: {};
    readonly primaryKey: readonly [];
    readonly uniqueConstraints: {
      readonly _pgroll_new_players_stats_xata_id_key: {
        readonly name: "_pgroll_new_players_stats_xata_id_key";
        readonly columns: readonly ["xata_id"];
      };
    };
    readonly columns: readonly [
      {
        readonly name: "Agents";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Assists";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Assists_Per_Round";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Average_Combat_Score";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Average_Damage_Per_Round";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Clutch_Success";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Clutches_won_played";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Deaths";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "First_Deaths";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "First_Deaths_Per_Round";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "First_Kills";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "First_Kills_Per_Round";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Headshot_Percentage";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "KD";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Kill_Assist_Trade_Survive_Percentage";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Kills";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Kills_Per_Round";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Match_Type";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Maximum_Kills_in_a_Single_Map";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Player";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Rating";
        readonly type: "float";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Rounds_Played";
        readonly type: "int";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Stage";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Teams";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "Tournament";
        readonly type: "text";
        readonly notNull: false;
        readonly unique: false;
        readonly defaultValue: any;
        readonly comment: "{}";
      },
      {
        readonly name: "xata_createdat";
        readonly type: "datetime";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "now()";
        readonly comment: "";
      },
      {
        readonly name: "xata_id";
        readonly type: "text";
        readonly notNull: true;
        readonly unique: true;
        readonly defaultValue: "('rec_'::text || (xata_private.xid())::text)";
        readonly comment: "";
      },
      {
        readonly name: "xata_updatedat";
        readonly type: "datetime";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "now()";
        readonly comment: "";
      },
      {
        readonly name: "xata_version";
        readonly type: "int";
        readonly notNull: true;
        readonly unique: false;
        readonly defaultValue: "0";
        readonly comment: "";
      }
    ];
  }
];
export type SchemaTables = typeof tables;
export type InferredTypes = SchemaInference<SchemaTables>;
export type MapsScores = InferredTypes["maps_scores"];
export type MapsScoresRecord = MapsScores & XataRecord;
export type PlayersStats = InferredTypes["players_stats"];
export type PlayersStatsRecord = PlayersStats & XataRecord;
export type DatabaseSchema = {
  maps_scores: MapsScoresRecord;
  players_stats: PlayersStatsRecord;
};
declare const DatabaseClient: any;
export declare class XataClient extends DatabaseClient<DatabaseSchema> {
  constructor(options?: BaseClientOptions);
}
export declare const getXataClient: () => XataClient;
export {};
